import React from "react"
import { Overlay } from "@mantine/core"

const UploadProgress = ({ percentage = 0 }) => {
  return (
    <Overlay blur={15} center opacity={0.15}>
      <div className="w-5/6 bg-gray-200 rounded-full bg-white">
        <div
          className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-[0.10px] leading-none rounded-full"
          style={{ width: `${percentage}%` }}
        >
          {percentage}%
        </div>
      </div>
    </Overlay>
  )
}

export default UploadProgress
