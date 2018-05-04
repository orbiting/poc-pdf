import React from 'react'
import express from 'express'
import fs from 'fs'
import path from 'path'
import 'regenerator-runtime/runtime'
import { createElement, pdf, PDFRenderer } from '@react-pdf/core'
import { createApolloFetch } from 'apollo-fetch'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const PORT = process.env.PORT || 3007

const Document = require('./components/Document').default

const query = `
  query getDocument($path: String!) {
    article: document(path: $path) {
      id
      content
      meta {
        template
        path
        title
        description
        image
        color
        format {
          meta {
            path
            title
            color
            kind
          }
        }
      }
    }
  }
`

const server = express()

const render = async (article, query, response) => {
  const container = createElement('ROOT')
  const node = PDFRenderer.createContainer(container)

  const format = article.meta.format || {}
  const formatMeta = format.meta || {}
  const formatTitle = formatMeta.title
  const formatColor = formatMeta.color

  PDFRenderer.updateContainer(
    <Document article={article} options={{
      formatTitle,
      formatColor,
      images: query.images !== '0'
    }} />,
    node,
    null
  )

  response.set('Content-Type', 'application/pdf')
  if (query.download) {
    const fileName = article.meta.path
      .split('/')
      .filter(Boolean)
      .join('-')
    response.set(
      'Content-Disposition',
      `attachment; filename="${fileName}.pdf"`
    )
  }

  const output = await pdf(container).toBuffer()
  output.pipe(response)
}

const stripDotPdf = path => path.replace(/\.pdf$/, '')

server.get('/fixtures/:path', (req, res) => {
  const fixturePath = path.join(
    __dirname, '..', 'fixtures',
    `${stripDotPdf(req.params.path)}.json`
  )
  if (!fs.existsSync(fixturePath)) {
    res.status(404).end('No Fixture Found')
    return
  }
  const api = JSON.parse(
    fs.readFileSync(fixturePath, 'utf8')
  )
  render(api.data.document, req.query, res)
})

server.get('/:path*', async (req, res) => {
  const variables = {
    path: stripDotPdf(req.path)
  }

  const apolloFetch = createApolloFetch({
    uri: process.env.API_URL
  })
  const api = await apolloFetch({ query, variables })

  if (!api.data.article) {
    res.status(404).end('No Article Found')
    return
  }
  render(api.data.article, req.query, res)
})

server.listen(PORT, err => {
  if (err) throw err
  console.log(`> Ready on port ${PORT}`)
})
