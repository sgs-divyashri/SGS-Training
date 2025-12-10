import HelloWorld from "./core-concepts/01-helloWorld/helloWorld"
import Greeting from "./core-concepts/02-components/greeting"
import GreetingClass from "./core-concepts/02-components/greetingClass"
import JSXExample from "./core-concepts/03-jsx/jsxExample"
import PropsExample from "./core-concepts/04-props/propsExample"
import StateExample from "./core-concepts/05-state/stateExample"
import EventHandling from "./core-concepts/06-eventHandling/eventListeners"
import SimpleForm from "./core-concepts/06-eventHandling/simpleForm"
import Lists from "./core-concepts/07-lists&Keys/lists"
import TaskManager from "./TaskManager/taskManager"

function App() {
  return <TaskManager/>
  // return <Lists/>
  // return <SimpleForm/>
  // return <EventHandling/>
  // return <StateExample/>
  // return <PropsExample title="Welcome to React Tutorial"/>
  // return <JSXExample/>
  // return <GreetingClass/>
  // return < Greeting />
  // return < HelloWorld />
}

export default App
