import { defineBuilderConfig } from '@afilmory/builder'

export default defineBuilderConfig(() => ({
  storage: {
    provider: 'local',
    basePath: process.env.PHOTO_BASE_PATH || '/photos',
    baseUrl: process.env.PHOTO_BASE_URL || '/photos',
    excludeRegex: '(^|/)(@eaDir|@synoeastream|@synoresource)(/|$)|(^|/)synoindex_media_info$',
  },
  system: {
    processing: {
      defaultConcurrency: Number(process.env.BUILDER_CONCURRENCY || '2'),
      enableLivePhotoDetection: true,
    },
    observability: {
      showProgress: true,
      showDetailedStats: false,
      logging: {
        verbose: false,
        level: 'info',
        outputToFile: false,
      },
      performance: {
        worker: {
          timeout: 300000,
          useClusterMode: false,
          workerConcurrency: Number(process.env.BUILDER_CONCURRENCY || '2'),
          workerCount: 1,
        },
      },
    },
  },
}))
