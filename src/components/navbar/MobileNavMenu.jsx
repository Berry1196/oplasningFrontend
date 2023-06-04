import { Disclosure } from '@headlessui/react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

export default function MobileNavMenu({ open, navigation }) {
  return (
    <Disclosure.Panel className='sm:hidden'>
      <div className='space-y-1 px-2 pb-3 pt-2'>
        {navigation.map((item) => (
          <Disclosure.Button
            as={Link}
            to={item.href}
            key={item.name}
            className={classNames(item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium')}
          >
            {item.name}
          </Disclosure.Button>
        ))}
      </div>
      <div className='border-t border-gray-700 pb-3'>
        <div className='mt-3 space-y-1 px-2'>
          <Disclosure.Button as='a' href='#' className='block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white'>
            Log ind
          </Disclosure.Button>
        </div>
      </div>
    </Disclosure.Panel>
  )
}
