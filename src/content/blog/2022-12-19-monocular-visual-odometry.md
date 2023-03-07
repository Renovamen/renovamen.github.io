---
title: Implement Monocular Visual Odometry
tags:
  - computer vision
---

## toc

Monocular Visual Odometry (VO) is the process of estimating the pose (position and orientation) of a camera using only visual information from a single camera. It is a crucial component of many robotics and augmented reality systems, as it allows a device to understand its own movement and position in the world.

This blog would be focussing on how to implement a simple monocular VO algorithm in Python. If you are new to it, I suggest having a look at [this article](https://cmsc426.github.io/sfm/).

The overall process can be broken down into the following steps:

- Feature detection
- Feature tracking
- Estimating fundamental matrix
- Estimating essential matrix (from fundamental matrix)
- Recovering pose (from essential matrix)

## Problem

Suppose that we have a camera attached to a vehicle. A video coming from this camera has been processed for lens distortion and converted to frames. We denote the frames captured at time $i$ and $i+1$ as $I_i$ and $I_{i+1}$, respectively. For every pair of images $(I_i, I_{i+1})$, our job is to find the rotation matrix $R_i$ and the translation vector $t_i$, which describe the motion of the vehicle between the two frames.

## Feature Detection

We first look for salient landmarks, called keypoints $K_i$, in $I_i$. Keypoints are features that differ from their immediate neighborhood such as corners or areas with unique colors or textures. These features should ideally be found in both two adjacent frames.

Using OpenCV, detecting keypoints is trivial:

```python
import cv2

def detect_features(image):
    detector = cv2.GFTTDetector_create()

    kp = detector.detect(image)
    kp = cv2.KeyPoint_convert(sorted(kp, key=lambda p: p.response, reverse=True))

    return kp

kp1 = detect_features(image1)
```

Here GFTT (Good Features to Track) detector is used to detect keypoints. In my experiments, other detectors like SIFT (Scale Invariant Feature Transform) and ORB (Oriented Fast and Rotated Brief) perform worse than GFTT. Meanwhile, the speed of SIFT is much slower.

## Feature Tracking

We then need to track $K_i$'s corresponding keypoints $K_{i+1}$ in $I_{i+1}$ using optical flow. To improve the performance, you can choose to remove the keypoints that are not tracked in $I_{i+1}$ (`status` returned by `cv2.calcOpticalFlowPyrLK` is 0) or are outside $I_{i+1}$.

```python
def get_removed_pts_ids(pts, image, status):
    """Removes keypoints that are not tracked or are outside the image."""
    status_ = status.copy()

    for idx, pt in enumerate(pts):
        if pt[0] < 0 or pt[1] < 0 or pt[0] > image.shape[1] or pt[1] > image.shape[0]:
            status_[idx] = 0

    return np.where(status_ == 0)[0]

def track_features(image1, image2, kp1, remove_outliers: bool = False):
    """Tracks features using optical flow."""
    kp2, status, _ = cv2.calcOpticalFlowPyrLK(image1, image2, kp1, None)

    if remove_outliers:
        removed_ids = get_removed_pts_ids(kp2, image2, status)
        kp1 = np.delete(kp1, removed_ids, axis=0)
        kp2 = np.delete(kp2, removed_ids, axis=0)

    return kp1, kp2

kp1, kp2 = track_features(image1, image2, kp1, remove_outliers=True)
```

## Fundamental Matrix

The fundamental matrix $F = \begin{bmatrix}
    f_{11} & f_{12} & f_{13} \\
    f_{21} & f_{22} & f_{23} \\
    f_{31} & f_{32} & f_{33}
\end{bmatrix}$ is a $3 \times 3$ matrix that encodes the relative orientation and position of the camera between $I_i$ and $I_{i+1}$.

### 8-Point Algorithm

To estimate $F$, one of the solutions is [Hartley's normalized 8-point algorithm](https://www.cs.cmu.edu/~16385/s17/Slides/12.4_8Point_Algorithm.pdf), where the constraint for $F$ is:

$$
\begin{bmatrix}
    x_{i+1}^1 x_i^1 & x_{i+1}^1 y_i^1 & x_{i+1}^1 & y_{i+1}^1 x_i^1 & y_{i+1}^1 y_i^1 & y_{i+1}^1 & x_i^1 & y_i^1 & 1 \\
    \vdots & \vdots & \vdots & \vdots & \vdots & \vdots & \vdots & \vdots &  \vdots \\
    x_{i+1}^8 x_i^8 & x_{i+1}^8 y_i^8 & x_{i+1}^8 & y_{i+1}^8 x_i^8 & y_{i+1}^8 y_i^8 & y_{i+1}^8 & x_i^8 & y_i^8 & 1
\end{bmatrix}
\begin{bmatrix}
    f_{11} \\
    f_{12} \\
    f_{13} \\
    f_{21} \\
    f_{22} \\
    f_{23} \\
    f_{31} \\
    f_{32} \\
    f_{33}
\end{bmatrix}
= 0,
$$

which can be answered by solving the linear least squares using Singular Value Decomposition (SVD). This algorithm requires 8 keypoint correspondences exists, where $(x_i, y_i)$ are the coordinates of the 8 keypoints selected from $K_i$, and $(x_{i+1}, y_{i+1})$ are the coordinates of their corresponding keypoints in $K_{i+1}$. The coordinates should be normalized by shifting them around the mean of the points and enclosing them at a distance of $\sqrt{2}$ from the new center.

Given 8 keypoint correspondences, the code for computing $F$ is:

```python
import numpy as np

def normalize(pt: np.ndarray):
    """Normalizes the given set of points."""
    N = pt.shape[0]
    mean = pt - np.mean(pt, axis=0)

    scale = np.sum(np.square(pt)) / (2 * N)
    scale = np.sqrt(1 / scale)

    return scale * mean, scale

def compute_fundamental_mat(pt1: np.ndarray, pt2: np.ndarray)-> np.ndarray:
    """Computes the fundamental matrix F using SVD."""
    N = pt1.shape[0]

    norm_pt1, scale1 = normalize(pt1)
    norm_pt2, scale2 = normalize(pt2)

    T1 = np.array([
        [scale1, 0, - scale1 * np.mean(pt1[:, 0])],
        [0, scale1, - scale1 * np.mean(pt1[:, 1])],
        [0, 0, 1]
    ])

    T2 = np.array([
        [scale2, 0, - scale2 * np.mean(pt2[:, 0])],
        [0, scale2, - scale2 * np.mean(pt2[:, 1])],
        [0, 0, 1]
    ])

    A = []

    for i in range(N):
        x1, y1 = norm_pt1[i]
        x2, y2 = norm_pt2[i]

        a = np.array([x2 * x1, x2 * y1, x2, y2 * x1, y2 * y1, y2, x1, y1, 1])
        A.append(a)

    A = np.array(A)  # (N, 9)

    U1, S1, V1 = np.linalg.svd(A)
    F = V1[-1,:].reshape(3, 3)
    F /= F[2, 2]

    U2, S2, V2 = np.linalg.svd(F)
    S2 = np.diag(S2)
    S2[-1] = 0

    F = U2 @ S2 @ V2
    F = T2.T @ F @ T1

    return F
```

### RANSAC

Our feature detection and tracking algorithms are not perfect, leading to several erroneous correspondences (outliers). Therefore, RANSAC is used to remove these outliers.

RANSAC is an iterative algorithm terminating after a fixed number of iterations. At every iteration, it works in the following way:

- Picks 8 keypoint correspondences from $K_i$ and $K_{i+1}$
- Computes $F$ using Hartley's 8-point algorithm mentioned above
- Determines how many of all other keypoints are inliers

Finally, the $F$ with the maximum number of inliers will be used.

```python
def compute_ransac_error(F: np.ndarray, pt1: np.ndarray, pt2: np.ndarray):
    n = pt1.shape[0]

    p1 = np.hstack((pt1, np.ones((n, 1))))
    p2 = np.hstack((pt2, np.ones((n, 1))))

    e1 = p1 @ F.T
    e2 = p2 @ F

    error = np.sum(e2 * p1, axis=1, keepdims=True) ** 2 / np.sum(np.hstack((e1[:, :-1], e2[:, :-1])) ** 2, axis=1, keepdims=True)
    return error

def find_fundamental_mat(
    pt1: np.ndarray, pt2: np.ndarray, threshold: float = 0.05
)-> np.ndarray:
    """Estimates the fundamental matrix using RANSAC."""
    max_inliers = 0
    best_F = None
    confidence = 0.99

    N = sys.maxsize
    count = 0

    while N > count:
        x, y = sample_eight_points(pt1, pt2)

        F = compute_fundamental_mat(x, y)
        error = compute_ransac_error(F, pt1, pt2)

        inliers = error <= threshold
        n_inliers = np.sum(inliers)

        if max_inliers < np.sum(inliers):
            max_inliers = n_inliers
            best_F = F.copy()

        ratio = n_inliers / len(pt1)
        if np.log(1 - (ratio ** 8)) == 0:
            continue
        N = np.log(1 - confidence) / np.log(1 - (ratio ** 8))

        count += 1

    return best_F

F = find_fundamental_mat(kp1, kp2, 0.05)
```

Then the problem is how to pick 8 keypoint correspondences (`sample_eight_points`). While Hartley's 8-point algorithm samples them randomly, to make the algorithm more robust to outliers, we can use the way mentioned [here](https://www.crcv.ucf.edu/wp-content/uploads/2019/03/Lecture-13-FundamentalMatrix.pdf) (page 39) instead: uniformly dividing a frame into an $8 \times 8$ grid, then randomly selecting 8 grid cells and picking one pair of corresponding keypoints from each grid cell.

## Essential Matrix

Essential matrix $E$ is another $3 \times 3$ matrix. But unlike $F$, $E$ assumes that the cameras obey the pinhole model. More specifically, given the camera calibration matrix $K$, $E = K^T F K$, which also can be solved using SVD.

```python {6-10,12}
def find_essential_mat(K: np.ndarray, F: np.ndarray)-> np.ndarray:
    """Estimates the essential matrix."""
    E = K.T @ F @ K

    U, S, V = np.linalg.svd(E)
    S = np.asarray([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
    ])

    E = U @ S @ V
    E = E / np.linalg.norm(E)

    return E

E = find_essential_mat(K, F)
```

Note that the singular values of $E$ are not necessarily $(1, 1, 0)$ due to the noise in K. Thus $E$ should be reconstructed with $(1, 1, 0)$ singular values:

$$
E = U

\begin{bmatrix}
    1 & 0 & 0 \\
    0 & 1 & 0 \\
    0 & 0 & 0 \\
\end{bmatrix}

V^\top
$$

---

Now we have successfully estimated the essential matrix $E$ manually, looks cool! However, this can also be done with the help of OpenCV, and all you need is one line:

```python
E, mask = cv2.findEssentialMat(kp2, kp1, K, cv2.RANSAC, 0.999, 0.3, None)
```

OpenCV uses [Nistér's 5-point algorithm](https://www-users.cse.umn.edu/~hspark/CSci5980/nister.pdf), a more recent approach that is shown to give better results, to compute $E$. It requires the minimum number of keypoints possible since $E$ has only 5 degrees of freedom ($F$ has 7 degrees of freedom, $E$ has only 5 as it takes camera parameters into account).

## Camera Pose

Just follow [here](https://cmsc426.github.io/sfm/#essential) to recover the camera rotation matrix $R_i$ and translation vector $t_i$ from $E$.

```python
def linear_triangulation(
    T1: np.ndarray,
    R1: np.ndarray,
    T2: np.ndarray,
    R2: np.ndarray,
    pt1: np.ndarray,
    pt2: np.ndarray,
    K: np.ndarray,
)-> np.ndarray:
    """Linear triangulation."""
    P1 = K @ np.hstack((R1, -R1 @ T1))
    P2 = K @ np.hstack((R2, -R2 @ T2))

    X = []

    for i in range(len(pt1)):
        x1, x2 = pt1[i], pt2[i]

        A1 = x1[0] * P1[2, :] - P1[0, :]
        A2 = x1[1] * P1[2, :] - P1[1, :]
        A3 = x2[0] * P2[2, :] - P2[0, :]
        A4 = x2[1] * P2[2, :] - P2[1, :]

        A = np.asarray([A1, A2, A3, A4])
        U, S, V = np.linalg.svd(A)

        V = V[3]
        V = V / V[-1]

        X.append(V)

    return np.asarray(X)

def recover_pose(E: np.ndarray, pt1, pt2, K: np.ndarray):
    """Recovers the camera pose."""
    W = np.asarray([
        [0, -1, 0],
        [1,  0, 0],
        [0,  0, 1]
    ])
    U, S, V = np.linalg.svd(E)

    poses = {
        "T1":  U[:, 2].reshape(3, 1),
        "T2": -U[:, 2].reshape(3, 1),
        "T3":  U[:, 2].reshape(3, 1),
        "T4": -U[:, 2].reshape(3, 1),
        "R1":  U @ W   @ V,
        "R2":  U @ W   @ V,
        "R3":  U @ W.T @ V,
        "R4":  U @ W.T @ V
    }

    for i in range(1, 5):
        T, R = poses["T" + str(i)], poses["R" + str(i)]

        if np.linalg.det(R) < 0:
            T = -T
            R = -R
            poses["T" + str(i)], poses["R" + str(i)] = T, R

        I = np.identity(3)
        M = np.hstack((I, T.reshape(3, 1)))

        poses["P" + str(i)] = K @ R @ M

    max_Z, rt_idx = 0, 1

    for i in range(1, 5):
        T1, R1 = poses["T" + str(i)], poses["R" + str(i)]

        # ---------------------
        T2, R2 = np.asarray([[0],[0],[0]]), np.identity(3)

        X = linear_triangulation(T2, R2, T1, R1, pt1, pt2, K)
        Z = 0

        for j in range(X.shape[0]):
            x = X[j, :].reshape(-1, 1)
            if R1[2] @ np.subtract(x[0:3], T1) > 0 and x[2] > 0:
                Z += 1
        # ---------------------

        if max_Z < Z:
            max_Z, rt_idx = Z, str(i)

    cur_T, cur_R = poses["T" + rt_idx], poses["R" + rt_idx]

    if cur_T[2] < 0:
        cur_T = -cur_T

    return cur_T, cur_R

cur_T, cur_R = recover_pose(E, kp1, kp2, K)
```

---

Again, here is how to implement it in OpenCV:

```python
kp1 = np.array([pt for (idx, pt) in enumerate(kp1) if mask[idx] == 1])
kp2 = np.array([pt for (idx, pt) in enumerate(kp2) if mask[idx] == 1])
_, cur_R, cur_t, _ = cv2.recoverPose(E, kp2, kp1, K)
```

## Trajectory

Denote the pose of the camera as $R$ and $t$, which should be initialized as:

```python
R, T = np.identity(3), np.zeros((3, 1))
```

We can update the trajectory of the camera by:

$$
t = t + R t_i
$$

$$
R = R_i R
$$

```python
T = T + R @ cur_T
R = cur_R @ R
```

That's it! We can now move to the next pair of frames $(I_{i+1}, I_{i+2})$ and repeat from [here](#feature-detection).

Of course, there are many details and optimizations (e.g. bundle adjustment) that can be added to improve the accuracy and performance of the VO system, but this should give a good starting point for building a monocular VO system.

## References

- [Structure from Motion (University of Maryland)](https://cmsc426.github.io/sfm/)
- [The 8-point algorithm (Carnegie Mellon University)](https://www.cs.cmu.edu/~16385/s17/Slides/12.4_8Point_Algorithm.pdf)
- [Fundamental Matrix (University of Central Florida)](https://www.crcv.ucf.edu/wp-content/uploads/2019/03/Lecture-13-FundamentalMatrix.pdf)
- [An Efficient Solution to the Five-Point Relative Pose Problem](https://www-users.cse.umn.edu/~hspark/CSci5980/nister.pdf). _David Nistér_. IEEE Transactions on Pattern Analysis and Machine Intelligence, 2004.
- [Monocular Visual Odometry using OpenCV](https://avisingh599.github.io/vision/monocular-vo/)
