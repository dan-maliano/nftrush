
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link'

import {
    FacebookShareCount,
    HatenaShareCount,
    OKShareCount,
    PinterestShareCount,
    RedditShareCount,
    TumblrShareCount,
    VKShareCount
  } from "react-share";
export default function ArtPreview (props) {
    return (
        <div className='art-prev flex lg:flex-row items-center space-x-0 space-y-8 lg:space-x-8 lg:space-y-0 '>
            <div className='art-prev__img-wrap'>
                <img src={props.children.item.image} className='w-full art-prev__img'></img>
                <div className='art-prev__name-wrap'>
                    <h4 className='art-prev__category'>{props.children.item.category}</h4>
                    <h1 className='art-prev__title'>{props.children.item.name}</h1>
                </div>
            </div>

            <div className='art-prev__info-wrap'>
                <div className='art-prev__info'>

                    <p className='art-prev__description'>{props.children.item.description}</p>
                    <div className='art-prev__price'>
                        <div className="art-prev__price-icon">
                            <img src="/assets/svg/assets-logo.svg" alt="Polygon NFT" className=''></img>
                        </div>
                        <h1 className="">{props.children.item.price}Matic</h1>
                    </div>

                    <div className='art-prev__users grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div className='art-prev__user-wrap flex-1 flex flex-col space-y-6'>
                            <div className='flex flex-row space-x-4'>
                                <div className='art-prev__user-ava'></div>
                                <div className='art-prev__user-info'>
                                    <p className=''>Sell By</p>
                                    <p className='text-ellipsis overflow-hidden whitespace-nowrap'>{props.children.item.seller}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className='art-prev__user-wrap flex-1 flex flex-col space-y-6'>
                            <div className='flex flex-row space-x-4'>
                                <div className='art-prev__user-ava'></div>
                                <div className='art-prev__user-info'>
                                    <p className=''>Created By</p>
                                    <p className='text-ellipsis overflow-hidden whitespace-nowrap'>{props.children.item.creator}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {props.children.item.sold?"":      <button className='my-button shadow-md' onClick={()=>props.children.buyFunction(props.children.item)}>BUY NOW</button>
}
        </div>
    )
}