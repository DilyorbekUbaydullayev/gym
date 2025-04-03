import { Card } from "../ui/card"
import { MdOutlineTaskAlt } from "react-icons/md";
import { HiStatusOnline } from "react-icons/hi";
import { CiPlay1 } from "react-icons/ci";
import { Button } from "../ui/button";
import { Edit2, Trash } from "lucide-react";

const TaskItem = () => {
  return (
    <Card className="w-full p-4 shadow-md grid grid-cols-4 items-center gap-2 relative">
        <div className="flex gap-1 items-center col-span-2 w-[50%]">
            <MdOutlineTaskAlt className="text-blue-500"/>
            <span className="capitalize">Press</span>
        </div>
        <div className="flex gap-1 items-center">
            <HiStatusOnline/>
            <span className="capitalize text-sm">Unstarted</span>
        </div>
        <div className="flex gap-2 items-center justify-self-end">
            <Button variant={'ghost'} size={'icon'}>
                <CiPlay1 className="text-indigo-500 w-5 h-5"/>
            </Button>
            <Button variant={'secondary'} size={'icon'}>
                <Edit2 className=" w-5 h-5"/>
            </Button>
            <Button variant={'destructive'} size={'icon'}>
                <Trash className=" w-5 h-5"/>
            </Button>
        </div>
    </Card>
  )
}

export default TaskItem