---
title: Natural Gradient Decent
tags:
  - machine learning
  - math
---

[中文版本](/posts/zh/2021-07-28-natural-gradient-decent)

Natural gradient decent minimizes the loss function in distribution space with KL-divergence as metric, instead of the usual parameter space with Euclidean metric.

## toc

## Preliminary

### Gradient Decent

Assume that $L(\theta)$ is a loss function with first-order continuous partial derivatives, where $\theta \in R^n$. Now want to solve a unconstrained optimization problem:

$$
\min_\theta L(\theta)
$$

**Gradient descent** is an iterative optimization algorithm. It works by starting at a random point on the objective function and iteratively updating $\theta$. This process is repeated until the minimum is found or the algorithm converges. Formally, in $(k + 1)$th iteration, we have:

$$
\theta^{(k+1)} = \theta^{(k)} + \eta \vec{v} \tag{1}
$$

where $\eta$ is step size and $\vec{v}$ is update direction. The first order Taylor series expansion of $L(\theta^{(k+1)})$ at $\theta^{(k)}$ is:

$$
\begin{aligned}
  L(\theta^{(k+1)}) &= L(\theta^{(k)}) + \nabla L(\theta^{(k)}) \cdot (\theta^{(k+1)} - \theta^{(k)}) \textcolor{blue}{+ o(\theta^{(k)})}\\
    &= L(\theta^{(k)}) + \eta \vec{v} \cdot \nabla L(\theta^{(k)}) \textcolor{blue}{+ o(\theta^{(k)})}\\
    &\approx L(\theta^{(k)}) + \eta \vec{v} \cdot \nabla L(\theta^{(k)})
\end{aligned}
$$

We want to find a steepest descent direction around the local neighbourhood of $\theta$ in the parameter space, that is to minimize:

$$
L(\theta^{(k+1)}) - L(\theta^{(k)}) = \eta \vec{v} \cdot \nabla L(\theta^{(k)}) = \eta  \cdot \| \vec{v} \| \cdot \| \nabla L(\theta^{(k)}) \| \cdot \cos(\alpha)
$$

where $\alpha$ is the angle between $\vec{v}$ and $\nabla L(\theta^{(k)})$. Obviously, when $\alpha = - \pi$, i.e. when $\vec{v}$ and $\nabla L(\theta^{(k)})$ are in the opposite directions, $\cos(\alpha) = -1$ and the loss decrease most greatly. This is why gradient decent moves in the direction of the negative gradient:

$$
\vec{v} = - \frac{\nabla L(\theta^{(k)})}{\| \nabla L(\theta^{(k)}) \|}
$$

Now we can write Eq. 1 as:

$$
\theta^{(k+1)} = \theta^{(k)} - \frac{\eta}{\| \nabla L(\theta^{(k)}) \|} \cdot \nabla L(\theta^{(k)})
$$

where $\frac{\eta}{\| \nabla L(\theta^{(k)}) \|}$ is learning rate.

### KL Divergence

The **Kullback-Leibler divergence**, also known as the **relative entropy**, is a measure of the difference between current probability distribution $p$ and target distribution $q$, which is defined as:

$$
KL (p \| q) = \int p(x) \log \frac{p(x)}{q(x)} dx
$$

The KL divergence is zero if and only if the two distributions are equal. Note that KL divergence is non-symmetric, meaning that the KL divergence between $p$ and $q$ is not necessarily equal to that between $q$ and $p$.

### Fisher Information Matrix

I suggest having a look at this [great article](https://agustinus.kristia.de/techblog/2018/03/11/fisher-information/). To be short, the **Fisher Information Matrix** is:

- the second moment of the first-order derivative of the log-likelihood function:

  $$
  F = \mathbb{E}_{p(x \mid \theta)} \Big [ \nabla \log p(x \mid \theta) \nabla \log p(x \mid \theta)^T \Big ]
  $$

- the negative expectation of the Hessian matrix of the log-likelihood function ([proof](https://agustinus.kristia.de/techblog/2018/03/11/fisher-information/)):

  $$
  F = - \mathbb{E}_{p(x \mid \theta)} \left [ \frac{\partial^2}{\partial_{\theta} \partial_{\theta^T}} \log p(x \mid \theta) \right ]
  $$

### KL Divergence & Fisher Information

Let $d \to 0$, we have:

$$
KL \Big ( p(x \mid \theta) \| p(x \mid \theta + d) \Big ) \approx \frac{1}{2} d^T F d
$$

:::details[Proof]
For convenience, we denote $p(x \mid \theta)$ and $p(x \mid \theta + d)$ as $p(\theta)$ and $p(\theta + d)$, respectively.

$$
\begin{aligned}
  KL \Big ( p(\theta) \| p(\theta + d) \Big ) &= \int p(\theta) \log \frac{p(\theta)}{p(\theta + d)} dx = \mathbb{E}_{p(\theta)} \left [ \log \frac{p(\theta)}{p(\theta + d)} \right ] \\
    &= \mathbb{E}_{p(\theta)} [ \log p(\theta) ] - \textcolor{blue}{\mathbb{E}_{p(\theta)} [ \log p(\theta + d) ]}  \\
    &\approx \mathbb{E}_{p(\theta)} [ \log p(\theta) ] - \textcolor{blue}{\underbrace{\mathbb{E}_{p(\theta)} \left [ \log p(\theta) + \nabla \log p(\theta) d + \frac{1}{2} d^T \nabla^2 \log p(\theta) d \right ]}_{\text{second order Taylor expansion}}}  \\
    & = - \mathbb{E}_{p(\theta)} [ \nabla \log p(\theta) d ] - \mathbb{E}_{p(\theta)} \left [ \frac{1}{2} d^T \nabla^2 \log p(\theta) d \right ] \\
    &= - \left [ \int_{\theta} p(\theta) \frac{1}{p(\theta)} \nabla p(\theta) d \theta \right ] d - \frac{1}{2} d^T \mathbb{E}_{p(\theta)} [ \nabla^2 \log p(\theta) ] d \\
    &= - \left [ \nabla \int_{\theta}  p(\theta) d \theta \right ] d - \frac{1}{2} d^T \mathbb{E}_{p(\theta)} [ \nabla^2 \log p(\theta) ] d \\
    & = - \frac{1}{2} d^T \underbrace{\mathbb{E}_{p(\theta)} [ \nabla^2 \log p(\theta) ]}_{= - F} d \\
    & = \frac{1}{2} d^T F d
\end{aligned}
$$

:::

Which means the Fisher Information Matrix $F$ defines the local curvature in distribution space for which KL-divergence is the metric.

### Riemannian manifold

#### Manifold

A manifold is a topological space sharing the local properties of Euclidean spaces. Every point on a manifold has a small neighborhood around it that can be locally approximated by a tangent plane, which means that the curvature of this neighborhood is approximately zero. This allows us to use the Euclidean metric, which is based on the properties of flat space, to measure distance within this small neighborhood. To help your understanding, people on earth may experience their surroundings as being flat, but they are unable to perceive the curvature of the earth due to its large size.

More formally: A manifold $M$ of dimension $n$ is a topological space, such that every point $x \in M$ has a neighbourhood which is homeomorphic to an open set in Euclidean space $\Reals^n$. This open set in Euclidean space is called **tangent space**, refered as $T_x M$.

#### Riemannian Metric

The distance between two points in an Euclidean space can be easily determined by taking the modulusof the vector connecting the points. However, manifolds are not linear spaces, so we need to use alternative methods to calculate lengths on a manifold. One possible approach is to consider a continuous, differentiable curve, represented by $\gamma: [a, b] \to M$, on the manifold and compute the integral of the distance differential at each point along curve $\gamma$:

$$
L(\gamma) = \int_a^b \| \gamma'(x) \| dx
$$

Thus for each point $\gamma(x)$, we have to define a notion of distance in the tangent space at that point. We then use the notion to calculate the modulus $\| \gamma'(x) \|$ of the tangent vector $\gamma'(x) = \frac{\partial}{\partial x} \gamma(x)$ at the point and add up all of $\| \gamma'(x) \|$ to obtain the total length of the curve.

To calculate $\| \gamma'(x) \|$:

$$
\| \gamma'(x) \|^2 = ⟨ \gamma'(x), \gamma'(x) ⟩ = g_{\gamma(x)} (\gamma'(x), \gamma'(x))
$$

The square of the modulus of a vector, also known as the Euclidean norm or the $\ell_2$ norm, is equal to the inner product of the vector with itself. This means that $g_x: T_x M \times T_x M \to \Reals$ defines a **metric**, which is a way of measuring distance, over a tangent space. A metric that varies smoothly with respect to a point on a manifold is known as a **Riemannian metric**, and a manifold equipped with a Riemannian metric is called a **Riemannian manifold**.

As explained [here](https://www.math.fsu.edu/~whuang2/pdf/ECNU_slides.pdf) (page 4):

> Roughly, a Riemannian manifold $M$ is a smooth set with a smoothly-varying inner product on the tangent spaces.

Formally, for each $x \in M$，a Riemannian metric $g = g_x$ satisfies:

- $g(u, v) = g(v, u)$ for all $u, v \in T_x M$
- $g(u, u) \geq 0$ for all $u \in T_x M$
- $g(u, u) = 0$ if and only if $u = 0$

## Natural Gradient Decent

### Constrained Optimization

Let's start with looking at **natural gradient decent** from aspect of constrained optimization. In traditional gradient decent, the constrained optimization problem we want to solve is:

$$
\begin{gathered}
  \min_{d} L(\theta + d) \\
  \text{s.t.} \enspace \| d \| \leq \epsilon
\end{gathered}
$$

where the distance in parameter space is contrained and can be calculated using Euclidean metric.

As mentioned [before](#gradient-decent), the steepest descent direction is the direction of the negative gradient:

$$
- \frac{\nabla L(\theta)}{\| \nabla L(\theta) \|} = \lim_{\epsilon \to 0} \frac{1}{\epsilon} \arg \min_{d \text{ s.t.} \| d \| \leq \epsilon} L(\theta + d)
$$

When using gradient descent, the distribution of the parameters may change as the optimization process progresses. However, it is also important to ensure that the amount of change in the distribution is controlled, as large changes can lead to instability in the model. The Euclidean distance, which is based on the properties of flat space, may not be an appropriate measure of the amount of change in the distribution. Therefore, natural gradient decent works in **distribution space** and uses KL divergence to compare the current distribution of parameters $p(x \mid \theta)$ with the target distribution $p(x \mid \theta + d)$. Now the constraint becomes:

$$
\text{s.t.} \enspace KL \Big ( p(x \mid \theta) \| p(x \mid \theta + d) \Big ) \leq \epsilon
$$

We apply the Lagrange multiplier method to it:

$$
\begin{aligned}
  d^* &= \arg \min_{d} L(\theta + d) + \lambda \Big ( KL \big ( p(x | \theta) \| p(x | \theta + d) \big ) - \epsilon \Big )  \\
    &\approx \arg \min_{d} \underbrace{L(\theta) + \nabla L(\theta)^T d}_{\text{first order Taylor expansion}} + \underbrace{\frac{1}{2} \lambda d^T F d}_{\text{second order Taylor expansion}} - \lambda \epsilon
\end{aligned}
$$

To solve this minimization, we set its derivative to zero:

$$
\begin{aligned}
  0 &= \frac{\partial}{\partial d} \left [ L(\theta) + \nabla L(\theta)^T d + \frac{1}{2} \lambda d^T F d  - \lambda \epsilon \right ] \\
    &= \nabla L(\theta) + \lambda F d \\
  \lambda F d &= -\nabla L(\theta) \\
  d &= - \frac{1}{\lambda} F^{-1} \nabla L(\theta)
\end{aligned}
$$

Finally, the optimal descent direction is $\tilde{\nabla} L(\theta) = F^{-1} \nabla L(\theta)$ (constant factor can be absorbed into the learning rate), called **natural gradient**.

### Riemannian Manifold

Now we consider optimizing the objective function on a manifold. We can easily recognize that the descent direction depends on how to calculate $\|d\|$, i.e., what's the metric on the manifold.

The tranditional gradient decent works on parameter space (a Euclidean space), of which the metric is Euclidean metric. The natural gradient descent operates in distribution space (a Riemannian manifold), in which a point, represented by $p(x \mid \theta)$, can be thought of as a parameterized probability distribution. When the parameter $\theta$ changes to $\theta + d$, the distance between $p(x \mid \theta)$ and $p(x \mid \theta + d)$ is $\frac{1}{2} d^T F d$. It can be seen that the Fisher information matrix $F$ serves as the Riemannian metric on this Riemannian manifold.

The Fisher information matrix reflects the local curvature of the likelihood probability distribution space, which means that it encodes information about how much the probability distribution changes as the parameters vary. By using the Fisher information matrix as a measure, we can obtain the descent direction that takes into account the curvature of the probability distribution space. This is important because the larger the curvature, the smaller the range of parameter values that can be used to maintain a given likelihood. Natural gradient descent ensures that the optimization process respects the underlying geometry of the probability distribution space and avoids making large, unstable changes to the parameters.

## References

- [Natural Gradient Descent](https://agustinus.kristia.de/techblog/2018/03/14/natural-gradient/). _Agustinus Kristiadi_.
- [Differential Geometry](https://maths-people.anu.edu.au/~andrews/DG/). _Ben Andrews_. Australian National University.
- [Differential Geometry](http://people.maths.ox.ac.uk/~joyce/Nairobi2019/Hitchin-DifferentiableManifolds.pdf). _Nigel Hitchin_. Oxford University.
- [Riemannian Metrics](https://www.ime.usp.br/~gorodski/teaching/mat5771/ch1.pdf). _Claudio Gorodski_. University of São Paulo.
- [Geometric Deep Learning: Going beyond Euclidean Data](https://arxiv.org/abs/1611.08097). IEEE Signal Processing Magazine 2017. _Michael M. Bronstein, et al_.
