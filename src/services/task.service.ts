import { db } from "@/firebase"
import { ITask, ITaskData } from "@/types"
import { collection, getDocs, query } from "firebase/firestore"

export const TaskService = {
    getTasks : async()=>{
        let weekTotal=0
        let monthTotal=0
        let total=0
        const q = query(collection(db,'tasks'))
      const quarySnapshot = await getDocs(q)

      let taskData:ITaskData

      const tasks = quarySnapshot.docs.map(doc=>({
        ...doc.data(),
        id:doc.id
      })) as ITask[]

      taskData={
        tasks,
        weekTotal,
        monthTotal,
        total,
      }
      return taskData
    }
}