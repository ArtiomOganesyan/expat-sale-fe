import Box from "@mui/material/Box"
import SpeedDial from "@mui/material/SpeedDial"
import SpeedDialAction from "@mui/material/SpeedDialAction"
import { type ElementType, useState } from "react"

import style from "./SpeedDial.module.css"

type BasicSpeedDialProps = {
  actions: any[]
  Icon: ElementType
}

export default function BasicSpeedDial({
  actions = [],
  Icon,
}: BasicSpeedDialProps) {
  const [open, setOpen] = useState(false)

  return (
    <Box sx={{ background: "red" }}>
      <SpeedDial
        ariaLabel="Auth SpeedDial"
        className={style.speedDial}
        icon={<Icon />}
        onClick={() => {
          setOpen(!open)
        }}
        open={open}
      >
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            slotProps={{
              tooltip: {
                title: action.name,
                placement: "left",
                open,
              },
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  )
}
