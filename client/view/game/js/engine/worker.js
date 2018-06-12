import Astar from './Astar'

self.onmessage = function (e) {
  const path = Astar(e.data, {
    x: 975,
    y: 0
  })
  console.log(path)
  self.postMessage(path)

}
