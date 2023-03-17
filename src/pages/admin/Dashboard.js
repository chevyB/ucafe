import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Tabs, Text } from "@mantine/core"
import { IconBuildingStore, IconUsers } from "@tabler/icons-react"

import UserList from "./UserList"
import Template from "../components/templates/Template"
import StoreList from "../components/organisms/StoreList"

const Dashboard = () => {
  const { type } = useParams()
  const navigate = useNavigate()

  const onChangeTab = (url) => {
    navigate(url)
  }

  return (
    <Template>
      <Tabs defaultValue={type ?? "stores"}>
        <Tabs.List>
          <Tabs.Tab
            onClick={() => onChangeTab("/admin/stores")}
            value="stores"
            icon={<IconBuildingStore size="0.8rem" />}
          >
            Stores
          </Tabs.Tab>
          <Tabs.Tab
            onClick={() => onChangeTab("/admin/users")}
            value="users"
            icon={<IconUsers size="0.8rem" />}
          >
            Customers
          </Tabs.Tab>
        </Tabs.List>

        {type === "users" ? (
          <Tabs.Panel value="users" p="sm">
            <div className="max-w-2xl mx-auto py-2">
              <Text color="blue" fz="md" className="font-medium">
                Latest Customers
              </Text>
            </div>
            <UserList />
          </Tabs.Panel>
        ) : (
          <Tabs.Panel value="stores" p="sm">
            <div className="md:w-3/4 mx-auto py-2 grid grid-cols-1 md:grid-cols-2 gap-2 ">
              <Text color="blue" fz="md" className="font-medium">
                Store List
              </Text>
            </div>
            <StoreList />
          </Tabs.Panel>
        )}
      </Tabs>
    </Template>
  )
}

export default Dashboard
