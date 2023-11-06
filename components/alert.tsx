import { ReactNode } from 'react'

interface Alert {
  icon?: React.SVGFactory
  title: string
  description?: string | ReactNode
}

export const DangerAlert = ({ icon: Icon, title, description }: Alert) => {
  return (
    <div
      className="mb-4 flex items-center rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800"
      role="alert"
    >
      {Icon && <Icon className="mr-3 inline h-4 w-4 flex-shrink-0" />}

      <div>
        <span className="font-medium">{title}</span> {description}.
      </div>
    </div>
  )
}
