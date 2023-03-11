import React from "react"
import StoreList from "./components/organisms/StoreList"
import Template from "./components/templates/Template"

const Home = () => {
  return (
    <Template>
      <div className="p-4">
        <StoreList />
      </div>
    </Template>
  )
}

export default Home
