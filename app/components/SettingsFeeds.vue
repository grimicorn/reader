<script setup>
const { state, addFeed, removeFeed } = useFeed();
</script>

<template>
  <section class="set-section">
    <h2>RSS &amp; Podcasts</h2>
    <p class="desc">
      Paste any feed URL — Reader auto-detects whether it's an article feed or a
      podcast.
    </p>
    <div class="add-feed">
      <div class="field">
        <RIcon name="rss" :size="16" />
        <input
          v-model="state.newFeedUrl"
          placeholder="https://example.com/feed.xml"
          @keyup.enter="addFeed"
        />
      </div>
      <button class="btn btn-primary" @click="addFeed">
        <RIcon name="plus" :size="16" /> Add feed
      </button>
    </div>
    <div class="feed-list">
      <div v-for="fd in state.feeds" :key="fd.id" class="feed-row">
        <span class="feed-ic" :style="{ '--c': fd.color }">
          <RIcon :name="fd.type === 'podcast' ? 'mic' : 'rss'" :size="16" />
        </span>
        <div class="feed-info">
          <div class="feed-name">{{ fd.name }}</div>
          <div class="feed-url">{{ fd.url }}</div>
        </div>
        <span v-if="fd.status === 'error'" class="feed-stat error"
          >fetch failed</span
        >
        <span v-else class="feed-stat count">{{ fd.count }} new</span>
        <button class="icon-btn" title="Remove" @click="removeFeed(fd.id)">
          <RIcon name="trash" :size="16" />
        </button>
      </div>
    </div>
  </section>
</template>
