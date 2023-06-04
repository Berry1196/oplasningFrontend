import { Link } from 'react-router-dom'
import classNames from 'classnames'

export default function DesktopNavMenu({ navigation }) {
  return (
    <div className='hidden sm:ml-6 sm:block'>
      <div className='flex space-x-4'>
        {navigation.map((item) => (
          <Link
            to={item.href}
            key={item.name}
            className={classNames(item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'px-3 py-2 rounded-md text-sm font-medium')}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
