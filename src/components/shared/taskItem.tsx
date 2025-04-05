import { Card } from "../ui/card"
import { MdOutlineTaskAlt } from "react-icons/md";
import { HiStatusOnline } from "react-icons/hi";
import { CiPlay1 } from "react-icons/ci";
import { Button } from "../ui/button";
import { Edit2, Trash } from "lucide-react";
import { ITask } from "@/types";


interface Props {
    task:ITask
    onStartEditing:()=>void,
    onDelete:()=>void
}

const TaskItem = ({task,onStartEditing,onDelete}:Props) => {
  return (
    <Card className="w-full p-4 shadow-md grid grid-cols-4 items-center gap-2 relative">
        <div className="flex gap-2 items-center col-span-2 w-full">
            <MdOutlineTaskAlt className="text-blue-500"/>
            <p className="capitalize w-full">{task.title}</p>
        </div>
        <div className="flex gap-1 items-center col-span-1">
            <HiStatusOnline/>
            <span className="capitalize text-sm">{task.status}</span>
        </div>
        <div className="flex gap-2 items-center justify-self-end col-span-1">
            <Button variant={'ghost'} size={'icon'}>
                <CiPlay1 className="text-indigo-500 w-5 h-5"/>
            </Button>
            <Button variant={'secondary'} size={'icon'} onClick={onStartEditing}>
                <Edit2 className=" w-5 h-5"/>
            </Button>
            <Button variant={'destructive'} size={'icon'} onClick={onDelete}>
                <Trash className=" w-5 h-5"/>
            </Button>
        </div>
    </Card>
  )
}

export default TaskItem