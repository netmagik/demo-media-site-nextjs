/**
 * This config is used to set up Sanity Studio that's mounted on the `/pages/studio/[[...index]].tsx` route
 */

import { scheduledPublishing } from '@sanity/scheduled-publishing'
import { visionTool } from '@sanity/vision'
import { theme } from 'https://themer.sanity.build/api/hues?preset=tw-cyan&primary=b595f9'
import { defineConfig, definePlugin } from 'sanity'
import { deskTool } from 'sanity/desk'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'
// import DocumentsPane from 'sanity-plugin-documents-pane'
import { workflow } from 'sanity-plugin-workflow'

import {
  LifestyleLogo,
  LifestyleWorkspaceLogo,
  ReviewsLogo,
  ReviewsWorkspaceLogo,
  TechLogo,
  TechWorkspaceLogo,
} from './logo'
import { mediaConfigPlugin, structure } from './plugins/config'
import defaultDocumentNode from './plugins/config/defaultDocumentNode'
import newsletterPlugin from './plugins/newsletter'
import variations from './plugins/variations'
import { schemaTemplates, schemaTypes } from './schemas'

// @TODO: update next-sanity/studio to automatically set this when needed
const basePaths = {
  tech: '/studio/tech',
  lifestyle: '/studio/lifestyle',
  reviews: '/studio/reviews',
}

const defaultConfig = (type: string) => {
  // const defaultConfig = (type) => {
  return definePlugin({
    name: 'default-config',
    schema: {
      types: (prev) => schemaTypes(prev, type),
      templates: schemaTemplates,
    },
    plugins: [
      deskTool({
        structure: (S, context) => structure(S, context, type),
        defaultDocumentNode,
      }),
      // Add an image asset source for Unsplash
      unsplashImageAsset(),
      visionTool({
        defaultApiVersion: '2022-11-11',
      }),
      mediaConfigPlugin(),
      scheduledPublishing(),
      newsletterPlugin(),
      workflow({
        schemaTypes: ['article'],
      }),
      variations()
    ],
  })()
}

export default defineConfig([
  {
    basePath: basePaths.tech,
    name: 'tech',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    title: process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE || 'Technology',
    plugins: [defaultConfig('tech')],
    icon: TechWorkspaceLogo,
    studio: {
      components: {
        logo: TechLogo,
      },
    },
  },
  {
    name: 'lifestyle',
    basePath: basePaths.lifestyle,
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    title: process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE || 'Lifestyle',
    theme,
    plugins: [defaultConfig('lifestyle')],
    icon: LifestyleWorkspaceLogo,
    studio: {
      components: {
        logo: LifestyleLogo,
      },
    },
  },
  {
    name: 'reviews',
    basePath: basePaths.reviews,
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET_REVIEWS || 'reviews',
    title: process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE || 'Reviews',
    theme,
    plugins: [defaultConfig('reviews')],
    icon: ReviewsWorkspaceLogo,
    studio: {
      components: {
        logo: ReviewsLogo,
      },
    },
  },
])
