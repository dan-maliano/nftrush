import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link'
import InputDialog from '../../components/dialog/input'
import LoaderDialog from '../../components/dialog/loader'
import SuccessDialog from '../../components/dialog/success'
import { useState,useEffect } from 'react'

export default function ArtGallery4(props) {


let [priceOpen, setPriceOpen] = useState(false)
let [loaderOpen, setLoaderOpen] = useState(false)
let [successOpen, setSuccessOpen] = useState(false)    

function closePriceModal() {
    
    setPriceOpen(false)
}

function openPriceModal() {
    setPriceOpen(true)
}

function closeLoaderModal() {
    setLoaderOpen(false)
}

function openLoaderModal() {
    closePriceModal()
    setLoaderOpen(true)

    setTimeout(purchaseSuccesss, 1000)
}

function closeSuccessModal() {
    closePriceModal()
    closeLoaderModal()
    setSuccessOpen(false)
}

function openSuccessModal() {
    setSuccessOpen(true)
}

function purchaseSuccesss() {
    closeLoaderModal()
    openSuccessModal()
}
    return (
        <div className='nft-list__wrap grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8'>
            {props.galleries.map((item, index) => (
                 <div key={item.itemId} className='nft-list__item w-full h-auto grid grid-cols-1'>
                    <div className='nft-list__item-wrap grid grid-cols-1 gap-2 p-4'>
                        <div className='nft-item__img bg-white'>
                        <Link href={{
                            pathname:`/market/${item.tokenId}/`,
                            query: {
                                id: `${item.itemId}`,
                               
                            }
                                }}>
                            <img src={item.image} alt={item.name} className='w-full h-auto'></img>
                            </Link>
                        </div>
                        <div className='nft-item__info'>
                            <div>
                                <p className="nft-item__category">{item.category}</p>
                                <h1 className="nft-item__name">{item.name}</h1>
                            </div>
                            <Link href={{
                            pathname:`/market/${item.tokenId}/`,
                            query: {
                                id: `${item.itemId}`,
                               
                            }
                                }}>
                                <button className="nft-item__link">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4 12C4 11.4477 4.46718 11 5.04348 11H18.9565C19.5328 11 20 11.4477 20 12C20 12.5523 19.5328 13 18.9565 13H5.04348C4.46718 13 4 12.5523 4 12Z" fill="#4CEBBB"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.3195 5.32372C12.7455 4.89209 13.4363 4.89209 13.8623 5.32372L19.6805 11.2185C19.8851 11.4257 20 11.7069 20 12C20 12.2931 19.8851 12.5743 19.6805 12.7815L13.8623 18.6763C13.4363 19.1079 12.7455 19.1079 12.3195 18.6763C11.8935 18.2446 11.8935 17.5448 12.3195 17.1132L17.3663 12L12.3195 6.8868C11.8935 6.45517 11.8935 5.75536 12.3195 5.32372Z" fill="#4CEBBB"/>
                                    </svg>
                                </button>
                            </Link>
                        </div>

                        <div className='nft-item__price'>
                            <div>
                                <img src="/assets/svg/assets-logo.svg" alt="Polygon NFT" className=''></img>
                            </div>
                            <h1>{item.price } Matic</h1>
                        </div>
                        <p className="nft-item__creator-title text-[#A2A6D0] text-xs">Creator</p>
                        <p className="nft-item__creator-address text-sm truncate ... ">{item.creator} </p>
                    </div>                            
                    
                    <div className="nft-item__buy-wrap">
                        <button className='my-button' onClick={openPriceModal}> {item.buttonTitle}</button>
                    </div>

                       {/* price input dialog  */}
       <InputDialog show={priceOpen} openPriceModal={openPriceModal} closePriceModal={closePriceModal} purchasingNft={openLoaderModal}>{{resellFucnction:props.children.resellFucnction,item:item}}</InputDialog>

                </div>
                
            ))}

{/* loader dialog  */}
<LoaderDialog show={loaderOpen} openLoaderModal={openLoaderModal}></LoaderDialog>

{/* success dialog  */}
{/* <SuccessDialog show={successOpen} closeSuccessModal={closeSuccessModal}>{{msg:"",title:"",buttonTitle:""}}</SuccessDialog> */}

        </div>

        
    )
}