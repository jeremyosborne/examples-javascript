var q = {}
q.concurrency = 3
q._numRunning = 0
q._taskq = []
q._startTask = function (task) {
  q._numRunning += 1
  task(function () {
    q._numRunning -= 1
    q._run()
  })
}
q._run = function () {
  while (q._numRunning < q.concurrency && q._taskq.length) {
    q._startTask(q._taskq.shift())
  }
}
q.push = function (task) {
  q._taskq.push(task)
  q._run()
}

if (require.main === module) {
  // Tests
  (function () {
    var taskGen = function () {
      return function (done) {
        var id = taskGen.masterId++
        console.log('task id %s is started.', id)
        setTimeout(function () {
          console.log('task id %s is done.', id)
          done()
        }, Math.random() * 2000)
      }
    }
    taskGen.masterId = 0

    console.log('Running test...')
    for (var i = 0; i < 20; i++) {
      q.push(taskGen())
    }
  })()
}
