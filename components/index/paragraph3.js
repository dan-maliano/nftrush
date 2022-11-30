import { useContext } from 'react'
import { ThemeContext } from './../../pages/_app'

export default function Paragraph3() {
    const {themeMode, toggleThemeMode} = useContext(ThemeContext)

    const sellNftDetails = [
        {
            iconUrl : "/assets/svg/sell-nft-icon1",
            title : "Add Your NFTs",
            description : "Upload your work, add a title and description, and customize your NFTs with properties, stats, and unlockable content",
        },
        {
            iconUrl : "/assets/svg/sell-nft-icon2",
            title : "Resell Items You Buy",
            description : "You can resell any NFT items that is buy from other user with new price and share it with friends",
        },
        {
            iconUrl : "/assets/svg/sell-nft-icon3",
            title : "Set Up Your Wallet",
            description : "Once you set up wallet of choice, connect it to opensky by clicking the wallet icon in the top right corner. Learn about the wallets we support",
        },
        {
            iconUrl : "/assets/svg/sell-nft-icon4",
            title : "List Items For Sale",
            description : "Sell your items with price and also have ability to cancel anytime from sale and edit price can work at etherum and bnb and polygon net, any network with solidity",
        },
    ]

    return (
        <div className='relative w-full h-auto'>
            <div className='benefits-wrap grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mx-4 mt-8 sm:mx-16 sm:mt-16 lg:mx-[9vw] lg:mt-[9vw]'>
                {sellNftDetails.map((item, index) => (
                    <div key={"sell-nft" + index.toString()} className='benefits__item'>
                        <div className='benefits__img-wrap'>
                            <img src={item.iconUrl + (themeMode ? '.svg' : '-dark.svg')}></img>
                        </div>
                        <div className='benefits__info'>
                            <h1 className='benefits__title'>{item.title}</h1>
                            <p className='benefits__descr'>{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}