import Link from "next/link"
export default function Paragraph1() {
    const title = "Discover, Collect, and Sell Extraordinary NFTs"
    const description = "NFT Rush is the world's first and largest NFT marketplace"
    
    return (
        <div className='prime relative flex flex-col space-y-8 md:flex-row md:space-y-0 md:items-center m-8 sm:m-16 '>
            {/* left element */}
            <div className='prime__content'>
                <h1 className='prime-title'>Discover, Collect, and Sell <br /><span>Extraordinary NFTs</span></h1>
                <p className='prime-undertitle'>{description}</p>
                <div className='double-buttons-wrap flex-1 flex flex-row gap-4 mt-[4vw]'>
                    <div className=''>
                    <Link href="./categories">
                        <button className='my-button prime-screen__button h-50px font-titleFont rounded-lg bg-[#F9DF00] text-slate-800 text-xs sm:text-base px-6 sm:px-10 py-1.5 sm:py-2 shadow-lg'>Collection</button>
                    </Link>
                    </div>
                    <div className=''>
                    <Link href="./create-nft">
                        <button className='my-button prime-screen__button prime-screen__button_secondary h-50px font-titleFont rounded-lg border text-white dark:text-gray-800 text-xs sm:text-base px-6 sm:px-10 py-1.5 sm:py-2 dark:border-gray-300 shadow-lg'>Create NFT</button>
                   </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}