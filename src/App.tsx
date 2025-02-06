import "./App.css"
import AuthCheck from "./features/auth/AuthCheck"
import Layout from "./pages/Layout/Layout"

const App = () => {
  return (
    <div>
      <AuthCheck />
      <Layout></Layout>
    </div>
  )
}

export default App
