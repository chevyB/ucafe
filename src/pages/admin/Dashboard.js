import Template from "../components/templates/Template"
import { Tabs, Text } from "@mantine/core"
import { IconBuildingStore, IconUsers } from "@tabler/icons-react"
import UserList from "./UserList"
import StoreList from "../components/organisms/StoreList"

const Dashboard = () => {
  return (
    <Template>
      <Tabs defaultValue="gallery">
        <Tabs.List>
          <Tabs.Tab value="gallery" icon={<IconBuildingStore size="0.8rem" />}>
            Stores
          </Tabs.Tab>
          <Tabs.Tab value="messages" icon={<IconUsers size="0.8rem" />}>
            Customers
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="gallery" p="sm">
          <div className="max-w-2xl mx-auto py-2">
            <Text color="blue" fz="md" className="font-medium">
              Store List
            </Text>
          </div>
          <StoreList />
        </Tabs.Panel>

        <Tabs.Panel value="messages" p="sm">
          <div className="max-w-2xl mx-auto py-2">
            <Text color="blue" fz="md" className="font-medium">
              Latest Customers
            </Text>
          </div>
          <UserList />
        </Tabs.Panel>
      </Tabs>
    </Template>
  )
}

export default Dashboard
