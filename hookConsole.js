
if (console.everything === undefined) {
    console.everything = [];
    function TS(){
      return (new Date).toLocaleString("sv", { timeZone: 'UTC' }) + "Z"
    }
    window.onerror = function (error, url, line) {
      console.everything.push({
        type: "exception",
        timeStamp: TS(),
        value: { error, url, line }
      })
      return false;
    }
    window.onunhandledrejection = function (e) {
      console.everything.push({
        type: "promiseRejection",
        timeStamp: TS(),
        value: e.reason
      })
    } 
  
    function hookLogType(logType) {
      const original= console[logType].bind(console)
      return function(){
        console.everything.push({ 
          type: logType, 
          timeStamp: TS(), 
          value: Array.from(arguments) 
        })
        original.apply(console, arguments)
      }
    }
  
    ['log', 'error', 'warn', 'debug'].forEach(logType=>{
      console[logType] = hookLogType(logType)
    })
}  

window.stdlog = window.alert.bind(window);
window.logs = [];
window.alert = function(){
    window.logs.push(Array.from(arguments).join("|"));
    window.stdlog.apply(window, arguments);
}

document.addEventListener("keyup",(ev)=>{
    if(ev.key == "`"){
      window.stdlog("Console: \n" + JSON.stringify(console.everything) + "\n Alerts: \n" + JSON.stringify(window.logs));
    }
    if(ev.key == "~"){
      let input = prompt('>');
      window.stdlog(eval(input));
    }
})

