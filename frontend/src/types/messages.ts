export type Messages = { 
   role: 'user' | 'model' | 'error'
   content: string 
   type?: 'error'
}

export type Chat = {
  id: string
  title: string
  messages: Messages[]
  createdAt: number
}