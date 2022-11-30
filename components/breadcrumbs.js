import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHomeAlt, faAngleRight } from '@fortawesome/free-solid-svg-icons'

export default function Breadcrumbs(props) {
    return (
        <div className='breadcrumbs flex flex-row justify-center items-center text-white dark:text-gray-800 text-center'>
            {/* <h1 className='flex-none text-xl sm:text-2xl font-bold capitalize'>{props.home}</h1> */}
            {/* <div className='border-r-2 border-[#787984]'>&nbsp;</div> */}
            <div className='flex-none text-md sm:text-base'>
                {/* <FontAwesomeIcon icon={faHomeAlt}></FontAwesomeIcon> */}
                <button className='breadcrumb__item breadcrumb__link'>Home</button>
            </div>
            {props.breadcrumbs.map((item, index) => (
                <div key={"breadcrumb" + index.toString()} className="flex-none flex flex-row items-center">
                    <div className='breadcrumb__separator'>
                        <FontAwesomeIcon icon={faAngleRight}></FontAwesomeIcon>
                    </div>
                    <p className='breadcrumb__item'>{item}</p>
                </div>
            ))}
        </div>
    )
}