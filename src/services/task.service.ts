import {  auth, db } from "@/firebase"
import { ITask, ITaskData } from "@/types"
import { collection, getDocs, query, where } from "firebase/firestore"
import {endOfMonth, endOfWeek, isWithinInterval, startOfMonth, startOfWeek} from 'date-fns'

export const TaskService = {
    getTasks : async()=>{
        let weekTotal=0
        let monthTotal=0
        let total=0

        const now = Date.now()
        const weekStart = startOfWeek(now)
        const weekEnd = endOfWeek(now)
        const monthStart = startOfMonth(now)
        const monthEnd = endOfMonth(now)

        const q = query(collection(db,'tasks'),where("userId","==",auth.currentUser?.uid))
      const quarySnapshot = await getDocs(q)

      let taskData:ITaskData

      quarySnapshot.docs.forEach(doc=>{
        const data = doc.data()
        const taskDate = new Date(data.startTime)
        const taskTime = data.totalTime || 0

        if(isWithinInterval(taskDate,{start:weekStart,end:weekEnd})){
          weekTotal+=taskTime
        }
        if(isWithinInterval(taskDate,{start:monthStart,end:monthEnd})){
          monthTotal+=taskTime
        }
        total+=taskTime
      })

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