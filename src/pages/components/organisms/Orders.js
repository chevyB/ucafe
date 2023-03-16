import React from "react"
import { Link } from "react-router-dom"
import { doc } from "firebase/firestore"
import { IconEye } from "@tabler/icons-react"
import { useDocument } from "react-firebase-hooks/firestore"
import { Accordion, Button, Group, Image, Stepper, Text } from "@mantine/core"

import { db } from "../../../api/base"
import { orderStatusIcon } from "../../../utils/helper"
import { ORDER_STATUS_NUM } from "../../../configs/config"

const Orders = ({ orders, is_store = false }) => {
  function AccordionLabel({ id, store_id, buyer_id, total, status }) {
    const docStore = doc(db, "stores", store_id)
    const docBuyer = doc(db, "users", buyer_id)
    const [obj] = useDocument(is_store ? docBuyer : docStore)

    return (
      <Group noWrap>
        {!is_store && <Image src={obj?.data().img} alt="" width={80} />}
        <div className="w-full">
          <Text className="truncate">{obj?.data().name}</Text>
          <Text size="sm" color="dimmed" weight={400}>
            ₱ {total.toLocaleString()}
          </Text>
          <div className="flex items-center text-gray-700">
            <span className={status !== "completed" && "animate-pulse"}>
              {" "}
              {orderStatusIcon(status)}{" "}
            </span>{" "}
            <Text className="pl-2">Order {status}.</Text>
          </div>
        </div>
        {is_store && (
          <Link to={`/seller/order/${id}`}>
            <Button
              size="xs"
              leftIcon={<IconEye size="0.8rem" />}
              className="bg-gradient-to-r from-cyan-500 to-blue-500"
            >
              View
            </Button>
          </Link>
        )}
      </Group>
    )
  }

  return (
    <Accordion variant="separated" chevronPosition={is_store ? "left" : "right"}>
      {orders.docs.map((item) => (
        <Accordion.Item value={item.id} key={item.id}>
          <Accordion.Control>
            <AccordionLabel {...item.data()} id={item.id} />
          </Accordion.Control>
          <Accordion.Panel>
            <Stepper
              active={ORDER_STATUS_NUM[item.data().status]}
              breakpoint="sm"
              size="sm"
            >
              <Stepper.Step
                label={
                  <span>
                    1<sup>st</sup> step
                  </span>
                }
                description="Order placed."
                icon={orderStatusIcon("placed")}
              />
              <Stepper.Step
                label={
                  <span>
                    2<sup>nd</sup> step
                  </span>
                }
                description="Order processing."
                icon={orderStatusIcon("processing")}
              />
              <Stepper.Step
                label={
                  <span>
                    3<sup>rd</sup> step
                  </span>
                }
                description="Order is ready."
                icon={orderStatusIcon("ready")}
              />
              <Stepper.Step
                label="Final step"
                description="Order is completed"
                icon={orderStatusIcon("completed")}
              />
            </Stepper>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}

export default Orders
