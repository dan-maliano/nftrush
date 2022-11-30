import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

export default function SuccessDialog(props) {


    let modalIconUrl ;
    let msg ;
    let title ;
    let buttonTitle;

    if(props.children.modalIconUrl !=null||props.children.modalIconUrl !=" "||props.children.modalIconUrl !=undefined){
        modalIconUrl =props.children.modalIconUrl

    }else {
        modalIconUrl ="/assets/svg/success-icon"

    }

    if(props.children.msg !=null||props.children.msg !=" "||props.children.msg !=undefined){
        msg =props.children.msg

    }else {
        msg ="Operation completed successfully"

    }

    if(props.children.buttonTitle !=null||""||undefined){
        buttonTitle =props.children.buttonTitle

    }else {
        buttonTitle ="View"

    }

    if(props.children.title !=null||""||undefined){
        title =props.children.title

    }else {
        title ="Succeeded"

    }


  
    
    return (
        <Transition appear show={props.show} as={Fragment}>
            <Dialog
            as="div"
            className="fixed inset-0 z-100 overflow-y-auto"
            onClose={props.closeSuccessModal}
            >
            <div className="min-h-screen px-4 text-center">
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                >
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-80 transition-opacity" />
                </Transition.Child>

                {/* This element is to trick the browser into centering the PriceModal contents. */}
                <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
                >
                &#8203;
                </span>
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
                >
                <div className="my-modal inline-block w-full max-w-md p-6 my-8 overflow-hidden align-middle transition-all shadow-xl">
                    <Dialog.Title
                    as="h3"
                    className="text-white text-2xl font-semibold leading-6 "
                    >
                    </Dialog.Title>

                    <div className='flex flex-col items-center space-y-4'>
                        <div className='my-modal__title-wrap'>
                            <img src={modalIconUrl + ('.svg')}></img>
                            <div className='modal__title'>{title}</div>
                        </div>
                        <div className='modal__text'>{msg}</div>
                        <button className='my-button text-base px-16 py-2 shadow-md' onClick={props.closeSuccessModal}>{buttonTitle}</button>
                    </div>
                </div>
                </Transition.Child>
            </div>
            </Dialog>
        </Transition>
    )
}