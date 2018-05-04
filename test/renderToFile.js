const rw = require('rw')
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const { queue } = require('d3-queue')

const {
  CONCURRENCY = 1,
  BASE_URL = 'http://localhost:3007',
  OFFSET = 0
} = process.env

// GraphQL Query
// {
//   documents {
//     nodes {
//       meta {
//         path
//         template
//       }
//     }
//   }
// }
const docs = JSON.parse(rw.readFileSync('/dev/stdin', 'utf8')).data.documents.nodes
  .filter(doc => !doc.meta.template || doc.meta.template === 'article')
  .slice(+OFFSET)

function fetchDoc (doc) {
  return fetch(`${BASE_URL}${doc.meta.path}`)
    .then(res => res.buffer())
    .then(buffer => {
      const file = path.join(
        __dirname,
        'out',
        `${doc.meta.path.replace(/\//g, ' ').trim().replace(/ /g, '-')}.pdf`
      )
      fs.writeFileSync(file, buffer)
      console.log('Done', doc.meta.path)
    })
    .catch(err => {
      console.error('Broken', doc.meta.path, err)
      process.exit()
    })
}

const q = queue(+CONCURRENCY)
docs.forEach(doc => q.defer((callback) => {
  fetchDoc(doc).then(() => callback(), () => callback())
}))
q.awaitAll((error) => {
  if (error) throw error
  console.log('All Done')
})
