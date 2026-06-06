<script setup>
definePageMeta({ layout: "bare" });
</script>

<template>
  <div class="auth">
    <aside class="auth-aside">
      <div class="glow"></div>
      <div class="brand"><RLogo :size="30" words /></div>
      <div class="auth-quote">
        <p>
          Everything you follow — articles, shows, videos, posts — arriving on
          one quiet, chronological page.
        </p>
        <div class="by">
          — no algorithm, no infinite scroll, just your sources
        </div>
        <div class="auth-srcs">
          <span class="auth-src src-rss"><RIcon name="rss" :size="18" /></span>
          <span class="auth-src src-podcast"
            ><RIcon name="mic" :size="18"
          /></span>
          <span class="auth-src src-video"
            ><RIcon name="video" :size="18"
          /></span>
          <span class="auth-src src-tweet"
            ><RIcon name="chat" :size="18"
          /></span>
          <span class="auth-src src-photo"
            ><RIcon name="photo" :size="18"
          /></span>
        </div>
      </div>
    </aside>

    <div class="auth-main">
      <div class="auth-card">
        <RLogo :size="34" />
        <h1>Welcome back</h1>
        <p class="lede">Sign in to pick up your feed where you left off.</p>
        <div class="oauth">
          <button class="btn" @click="navigateTo('/')">
            <RIcon name="sparkle" :size="15" /> Google
          </button>
          <button class="btn" @click="navigateTo('/')">
            <RIcon name="user" :size="15" /> Apple
          </button>
        </div>
        <div class="auth-sep">or with email</div>
        <div class="auth-field">
          <label>Email</label>
          <div class="field">
            <RIcon name="user" :size="16" /><input
              type="email"
              placeholder="you@domain.com"
              value="reader@example.com"
            />
          </div>
        </div>
        <div class="auth-field">
          <label>Password</label>
          <div class="field">
            <RIcon name="link" :size="16" /><input
              type="password"
              placeholder="••••••••"
              value="password"
            />
          </div>
        </div>
        <button
          class="btn btn-primary btn-block"
          style="margin-top: 8px"
          @click="navigateTo('/')"
        >
          Sign in <RIcon name="arrowRight" :size="16" />
        </button>
        <div class="auth-foot">
          New to Reader? <a @click="navigateTo('/')">Create an account</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.auth {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.05fr 1fr;
}
.auth-aside {
  background: var(--bg-2);
  border-right: 1px solid var(--border);
  padding: 48px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}
.auth-aside .glow {
  position: absolute;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  right: -160px;
  top: -120px;
  background: radial-gradient(
    circle,
    color-mix(in oklab, var(--accent) 30%, transparent),
    transparent 65%
  );
  filter: blur(20px);
}
.auth-quote {
  margin-top: auto;
}
.auth-quote p {
  font-size: 20px;
  line-height: 1.5;
  color: var(--ink);
  letter-spacing: -0.01em;
  max-width: 460px;
  text-wrap: pretty;
}
.auth-quote .by {
  font-size: 12px;
  color: var(--muted);
  margin-top: 14px;
}
.auth-srcs {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}
.auth-src {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--c);
}

.auth-main {
  display: grid;
  place-items: center;
  padding: 40px;
}
.auth-card {
  width: min(380px, 100%);
}
.auth-card h1 {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 22px 0 6px;
}
.auth-card .lede {
  font-size: 13px;
  color: var(--muted);
  margin: 0 0 26px;
}
.auth-field {
  margin-bottom: 13px;
}
.auth-field label {
  display: block;
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 7px;
}
.auth-field .field {
  height: 46px;
}
.oauth {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}
.auth-sep {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--faint);
  font-size: 11px;
  margin: 8px 0 18px;
}
.auth-sep::before,
.auth-sep::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--border);
}
.auth-foot {
  font-size: 12px;
  color: var(--muted);
  text-align: center;
  margin-top: 18px;
}
.auth-foot a {
  color: var(--accent);
  text-decoration: none;
  cursor: pointer;
}
.btn-block {
  width: 100%;
  height: 46px;
}

@media (max-width: 820px) {
  .auth {
    grid-template-columns: 1fr;
  }
  .auth-aside {
    display: none;
  }
}
</style>
