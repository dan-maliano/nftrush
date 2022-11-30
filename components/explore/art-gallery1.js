import Link from "next/link";

export default function ArtGallery1(props) {
    return (
        <div className='top-nfts-wrap flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {props.galleries.map((item, index) => (
                <div key={item.itemId} className="top-nft__item w-full grid grid-cols-1 justify-items-center gap-2 ">
                    <h1 className="text-xl sm:text-2xl xl:text-4xl">{item.name}</h1>
                    
                    <Link href={{
                            pathname:`/market/${item.tokenId}/`,
                            query: {
                                id: `${item.itemId}`,
                               
                            }
                                }}>
                    <div className="top-nft__img-wrap">
                        <img src={item.image} alt={item.name} className='w-1/2 lg:w-[45%] xl:w-[55%] h-auto rounded-full border-solid border-4 border-sky-500 '></img>
                    </div>
                    </Link>
                    <Link href={{
                            pathname:`/market/${item.tokenId}/`,
                            query: {
                                id: `${item.itemId}`,
                               
                            }
                                }}>
                    <button className='my-button'> {item.buttonTitle}</button>
                    </Link>
                </div>
            ))}
        </div>
    )
}