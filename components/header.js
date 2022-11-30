import Link from 'next/link'
import { Fragment, useState, useContext, useRef,useEffect } from 'react'
import { Disclosure, Menu, Transition, Switch } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone } from '@fortawesome/free-regular-svg-icons'
import { faMoon, faShoppingBag, faDollar,faCircleUser,faUserCircle} from '@fortawesome/free-solid-svg-icons'
import { ThemeContext } from '../pages/_app'
import Web3Provider from './web3';
import Web3 from "web3";
import { useWeb3 } from './web3'
import detectEthereumProvider from '@metamask/detect-provider'
import SuccessDialog from './dialog/success'

// themeMode : true : dark, false : light
export default function Header(props) {
    const [currentPage, setCurrentPage] = useState(props.current)
    const {themeMode, toggleThemeMode} = useContext(ThemeContext)
    
    const headers = [
        { name: 'Explore', href: '/explore ' },
        { name: 'Categories', href: '/categories' },
        { name: 'Create NFT', href: '/create-nft' },
    ]

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }


    const web3Api = useWeb3();
    console.log(web3Api)


  //Craete function to listen the change in account changed and network changes


  //Create LoadAccounts Function
  const account =   web3Api.account;
  const[accountBalance,setAccountBalance]= useState(0);

    useEffect(()=>{

        const loadBalance = async()=>{
            if(account){
                const myBalance = await web3Api.web3.eth.getBalance(account)
                const convertBalance = await  web3Api.web3.utils.fromWei(myBalance,"ether")
                setAccountBalance(convertBalance)
            
            }
        }

    loadBalance()

    },[account])
    //Connect Metamask Wallet
    const connectMetamask = async () => {
    const currentProvider = await detectEthereumProvider();
    console.log( "WE ARE IN META MASK CONNECT" );
    if (currentProvider) {
        // let web3InstanceCopy = new Web3(currentProvider);
        // setWeb3Instance(web3InstanceCopy);
        if (!window.ethereum.selectedAddress) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        }
        await window.ethereum.enable();
        let currentAddress = window.ethereum.selectedAddress;
        console.log(currentAddress);
        account=currentAddress;
        const web3 = new Web3(currentProvider);
        let amount = await web3.eth.getBalance(currentAddress);
        amount = web3.utils.fromWei(web3.utils.toBN(amount), "ether");
    } else {
        console.log('Please install MetaMask!');
    }

    }
    let [successOpen, setSuccessOpen] = useState(false)  
    let [loaderOpen, setLoaderOpen] = useState(false)




    function closeLoaderModal() {
        setLoaderOpen(false)
    }

    function openLoaderModal() {
        setLoaderOpen(true)

    
    }

    function closeSuccessModal() {
        setSuccessOpen(false)
    }

    function openSuccessModal() {
        setSuccessOpen(true)
    }

    useEffect(()=>{
        if(account){
            closeSuccessModal()
        }else{
            openSuccessModal()
        }

    },[account])






    // Cut Wallet
    if (process.browser) {
        var walletId = document.querySelectorAll('.cut-wallet');
        var str = walletId.length;
        console.log(walletId['0'])
        for (let i = 0; i < str; i++) {
        var inText = walletId[i].innerText;
        
        if (inText.length > 12) {
            inText = inText.slice(0, 6) + '...' + inText.slice(-3);
        }
        walletId[i].innerText = inText;
        }
    }

    return (


       
        <Disclosure as="nav" className="header z-50 fixed w-full transition-all">
        {({ open }) => (
            <div className='w-full 2xl:max-w-screen-2xl h-full mx-auto'>
                <div className="mx-auto px-4 sm:px-8 lg:px-[6vw] h-full">
                    <div className="relative flex items-center justify-between h-full">
                        <div className="hamburger-menu absolute inset-y-0 left-0 flex items-center">
                            {/* Mobile menu button*/}
                            <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-white dark:text-gray-800 focus:ring-neutral-400 focus:ring-2 focus:ring-inset">
                            <span className="sr-only">Open main menu</span>
                            {open ? (
                                <XIcon className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                            )}
                            </Disclosure.Button>
                        </div>

                        <div className="flex-1 flex items-center justify-center lg:items-stretch lg:justify-start h-full">
                            <div className="flex-none self-center">
                                <Link href="/">
                                    <a>
                                        <img src={"/assets/svg/logo-" + (themeMode ? "dark" : "light") + ".svg"} alt="Logo" className='header__logo'></img>
                                    </a>
                                </Link>
                            </div>
                            <div className="header__right-side lg:block lg:ml-70px flex-1 h-full">
                                <div className="items-center flex lg:space-x-1 xl:space-x-4 h-full">
                                    {headers.map((item, index) => (
                                    <div key={item.name} className={classNames('', index === currentPage ? 'nav__link nav__link_active' : 'nav__link', '')}>
                                        <Link href={item.href}>
                                            <a
                                                className=''
                                                aria-current={index === currentPage ? 'page' : undefined}
                                                onClick={() => setCurrentPage(index)}
                                            >{item.name}</a>
                                        </Link>
                                    </div>
                                    ))}

                                    <div className="flex-grow"></div>

                                    {/* dark or light mode */}
                                    <div className='theme-switch-wrap relative grid place-items-center'>
                                        <Switch checked={themeMode} onChange={toggleThemeMode} className={classNames(themeMode ? 'bg-gray-800' : 'bg-[#8B8DA1]', 'transition duration-150 ease-out relative inline-flex items-center h-6 rounded-full w-12 theme-switch-button')}>
                                            <div className='absolute left-0 w-1/2 text-[#FFE951] theme-switch-icon'>
                                                <FontAwesomeIcon icon={faMoon} ></FontAwesomeIcon>
                                            </div>
                                            <span className={classNames(themeMode ? 'bg-[#8B8DA1] translate-x-6' : 'bg-white translate-x-0', 'inline-block w-6 h-6 transform rounded-full transition duration-300 theme-switch-slider')}
                                            />
                                        </Switch>
                                    </div>

                                    {/* account address */}
                                   {account? <Menu as="div" className="relative inline-block text-left">
                                        <div className='h-full grid place-items-center'>
                                            <Menu.Button className="inline-flex justify-center w-full px-0 py-2 text-sm font-medium">
                                                <div className='header__account-wrap flex flex-row space-x-4'>
                                                    <div className='header__account-ava'></div>

                                                    <div className='header__account-info'>
                                                        <p className='header__account-address cut-wallet'> {account}</p>
                                                        <p className='header__account-balance'>{accountBalance} Matic</p>
                                                    </div>
                                                </div>
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                        >
                                        <Menu.Items className="user-dropdown absolute right-0 w-80 mt-4 origin-top-right shadow-lg">
                                            <div className='flex flex-col space-y-6'>
                                                <Link href="/account/myProfile">
                                                    <a>
                                                    <Menu.Item>
                                                        <div className='user-dropdown__account flex flex-row space-x-3'>
                                                            <div className=''>
                                                                <img className='user-dropdown__account-logo' src="/assets/svg/metamask-logo.svg"></img>
                                                            </div>
                                                            <div className='user-dropdown__account-balance'>
                                                                <p className=''>Matic Balance </p>
                                                                <p className=''>{accountBalance}</p>
                                                            </div>
                                                        </div>
                                                    </Menu.Item>
                                                    </a>
                                                </Link>

                                                <Link href="/market/nft-purchased">
                                                    <a className='user-dropdown__link'>
                                                        <Menu.Item>
                                                                <span>NFT Purchased</span>
                                                        </Menu.Item>  
                                                    </a>
                                                </Link>

                                                <Link href="/market/nft-resell">
                                                    <a className='user-dropdown__link'>
                                                        <Menu.Item>
                                                                <span>NFT Resell</span>
                                                        </Menu.Item> 
                                                    </a>
                                                </Link>

                                              
                                            </div>
                                        </Menu.Items>
                                        </Transition>
                                    </Menu>: 

                                    <button className='my-button my-button_connect text-white shadow-lg' onClick={connectMetamask}>Connect Wallet</button>
}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile menu button*/}
             
                    <Disclosure.Panel className="hidden-nav lg:hidden bg-[#24274D] dark:bg-white">
                    <div className="flex flex-col just space-y-4">
                        {headers.map((item, index) => (
                            <Disclosure.Button
                            key={item.name}
                            as="a"
                            href={item.href}
                            className={classNames('flex-1', 
                                index === currentPage ? 'hidden-nav__link_active hidden-nav__link' : 'hidden-nav__link', ''
                            )}
                            aria-current={index === currentPage ? 'page' : undefined}
                            >
                            {item.name}
                            </Disclosure.Button>
                        ))}

                        {/* dark or light mode */}
                        <div className='theme-switch-wrap flex-1 relative grid px-3 py-2'>
                            <Switch checked={themeMode} onChange={toggleThemeMode} className={classNames(themeMode ? 'bg-white' : 'bg-[#8B8DA1]', 'transition duration-150 ease-out relative inline-flex items-center h-6 rounded-full w-12 theme-switch-button')}>
                                <div className='absolute left-0 w-1/2 text-[#FFE951]'>
                                    <FontAwesomeIcon icon={faMoon} ></FontAwesomeIcon>
                                </div>
                                <span className={classNames(themeMode ? 'bg-[#8B8DA1] translate-x-6' : 'bg-white translate-x-0', 'inline-block w-6 h-6 transform rounded-full transition duration-300 theme-switch-slider')}
                                />
                            </Switch>
                        </div>

                        {/* account address */}
                        {account?  <Disclosure>
                        {({ open }) => (
                            <>
                                <Disclosure.Button className="hidden-nav__account-wrap flex justify-between w-full px-4 py-2 text-sm font-medium text-left focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                    <div className='flex flex-row space-x-4'>
                                        <div className='hidden-nav__account-ava'></div>

                                        <div className='hidden-nav__account-info flex flex-col '>
                                            <p className='flex-1 text-white dark:text-gray-800 text-sm font-bold cut-wallet'>{account}</p>
                                            <p className='text-[#7D82B2] text-xs text-left'>{accountBalance} Matic</p>
                                        </div>
                                    </div>
                                </Disclosure.Button>
                                <Disclosure.Panel className="pt-4 pb-2 text-sm text-gray-500">
                                    <div className='hidden-nav__user-dropdown flex flex-col space-y-6'>
                                        <Link href="/account/myProfile">
                                            <a>
                                                <div className='user-dropdown__account flex flex-row space-x-3'>
                                                    <div>
                                                        <img className='user-dropdown__account-logo' src="/assets/svg/metamask-logo.svg"></img>
                                                    </div>
                                                    <div className='user-dropdown__account-balance flex-1 flex flex-col '>
                                                        <p>Matic Balance </p>
                                                        <p>{accountBalance}</p>
                                                    </div>
                                                </div>
                                            </a>
                                        </Link>

                                        <Link href="/market/nft-purchased">
                                            <a className="user-dropdown__link">
                                                <div className='flex flex-row items-center space-x-4 text-white dark:text-gray-800'>
                                                    <span>NFT Purchased
                                                    </span>
                                                </div>
                                            </a>
                                        </Link>

                                        <Link href="/market/nft-resell">
                                            <a className="user-dropdown__link">
                                                <div className='flex flex-row items-center space-x-4 text-white dark:text-gray-800'>
                                                    <span>NFT Resell
                                                    </span>
                                                </div>
                                            </a>
                                        </Link>

                                       
                                    </div>
                                </Disclosure.Panel>
                            </>
                        )}
                        </Disclosure>:""
}
                      
                    </div>
                </Disclosure.Panel>

           
           
           
           
     
        <SuccessDialog show={successOpen} closeSuccessModal={closeSuccessModal}>{{modalIconUrl: "/assets/svg/attention-icon",msg:"Please Connect MetaMask With Polygon NetWork",title:"Attention",buttonTitle:"Cancel"}}</SuccessDialog>
 </div>
        )}
      
        </Disclosure>
 
   

    )
}