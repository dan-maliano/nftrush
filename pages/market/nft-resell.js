import Head from 'next/head'
import Link from 'next/link'
import { Fragment, useState, useRef,useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClone } from '@fortawesome/free-regular-svg-icons'
import { faTimesCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import Header from '../../components/header'
import Footer from '../../components/footer'
import Breadcrumbs from '../../components/breadcrumbs'
import ArtGallery5 from '../../components/explore/art-gallery5'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { TailSpin } from  'react-loader-spinner'
import Web3 from "web3"
import axios from 'axios'
import { useRouter } from 'next/router'
import SuccessDialog from '../../components/dialog/success'
import LoaderDialog from '../../components/dialog/loader'

import { useWeb3 } from '../../components/web3'
export default function NFtResell() {

    const web3Api = useWeb3();
  console.log(web3Api)
  
  
    //Craete function to listen the change in account changed and network changes
  
  
    //Create LoadAccounts Function
    const account =   web3Api.account;
    const router = useRouter();



    //Craete function to listen the change in account changed and network changes

    const providerChanged = (provider)=>{
        provider.on("accountsChanged",_=>window.location.reload());
        provider.on("chainChanged",_=>window.location.reload());

    }

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
         setLoaderOpen(true)
    
    
    }
    
    function closeSuccessModal() {
        setSuccessOpen(false)
    }
    
    function openSuccessModal() {
        setSuccessOpen(true)
    }

    //Load Contracts Function
    const[nftContract,setNFtContract]= useState(null)
    const[marketContract,setMarketContract]= useState(null)
    const[nftAddress,setNFtAddress]= useState(null)
    const[marketAddress,setMarketAddress]= useState(null)
    const[purchasedItems,setpurchasedItems]= useState([])
    const[newPrice,setNewPrice]=useState(0)
    const[resellItems,setResellItems]= useState([])

const [isLoading,SetIsLoading]= useState(true)

    useEffect(()=>{
        const LoadContracts = async()=>{
            openLoaderModal()
            //Paths of Json File
            const nftContratFile =  await fetch("/abis/NFT.json");
            const marketContractFile = await fetch("/abis/NFTMarketPlace.json");

//Convert all to json
           const  convertNftContratFileToJson = await nftContratFile.json();
           const  convertMarketContractFileToJson = await marketContractFile.json();

//Get The ABI
           const markrtAbi = convertMarketContractFileToJson.abi;
           const nFTAbi = convertNftContratFileToJson.abi;


           const netWorkId =  await web3Api.web3.eth.net.getId();

           const nftNetWorkObject =  convertNftContratFileToJson.networks[netWorkId];
           const nftMarketWorkObject =  convertMarketContractFileToJson.networks[netWorkId];

           if(nftMarketWorkObject && nftMarketWorkObject){
            const nftAddress = nftNetWorkObject.address;
            setNFtAddress(nftAddress)
            const marketAddress = nftMarketWorkObject.address;
            setMarketAddress(marketAddress)

            const deployedNftContract = await new web3Api.web3.eth.Contract(nFTAbi,nftAddress);
            setNFtContract(deployedNftContract)
            const deployedMarketContract = await new web3Api.web3.eth.Contract(markrtAbi,marketAddress);
            setMarketContract(deployedMarketContract)

                                    //TODO:
      





   
              //Fetch my item i Publish  it as resell
            const myResellItemsResult =  await deployedMarketContract.methods.getMyResellItems().call({from:account})

          console.log("myResellItemsResult",myResellItemsResult)

            console.log("*************")

         
            const resellItems = await Promise.all(myResellItemsResult.map(async item=>{
              const nftUrl = await deployedNftContract.methods.tokenURI(item.tokenId).call();
              console.log(nftUrl)
              console.log(item)
              const priceToWei = Web3.utils.fromWei((item.price).toString(),"ether")
              const metaData =  await axios.get(nftUrl);
            let myItem = {
              price:priceToWei,
              itemId : item.id,
              tokenId:item.tokenId,
              owner :item.owner,
              seller:item.seller,
              oldOwner :item.oldOwner,
              creator:item.creator,
              oldSeller :item.oldSeller,

              oldPrice:item.oldPrice,
              image:metaData.data.image,
              name:metaData.data.name,
              description:metaData.data.description,
              category:metaData.data.category,

              isResell:item.isResell,
              buttonTitle :"Cancel From Sell"
          }
          
          console.log(myItem)
          return myItem;
            }))

            setResellItems(resellItems)
            SetIsLoading(false)
            closeLoaderModal()
 
           }else{
               openSuccessModal()

        }


        }
        web3Api.web3&&LoadContracts()

    },[account])

    const resellItemFunction = async(item,newPrice)=>{
      console.log(marketContract)
      console.log(nftAddress)


      if(marketContract){

        let marketFees = await marketContract.methods.gettheMarketFees().call()
        marketFees =marketFees.toString()
        const priceToWei = Web3.utils.toWei(newPrice,"ether")
        console.log(priceToWei);

      
   
        try{
          await marketContract.methods.putItemToResell(nftAddress,item.itemId,priceToWei).send({from:account, value:marketFees});
          console.log("Resell NFt")
          router.push("/")

         }catch(e){
           console.log(e)

         }
       }

      
    
      
    }



    //Create nft Buy Function
const cancelResellNFT = async (nftItem)=>{
  console.log("********")
  console.log(account)
  console.log(nftAddress)
  console.log(marketContract)
  const convertIdtoInt = Number(nftItem.itemId)

  openLoaderModal()

  //TODO send the nft price to the seller
  if(account){
   try{
    openLoaderModal()

      const result =  await marketContract.methods.cancelResellWitholdPrice(nftAddress,convertIdtoInt).send({from:account})
      closeLoaderModal()
      router.reload()
      console.log(result)

 
   }catch(e){
     console.log(e)
   }
  }


 


}

    const breadcrumbs = ["Explore", "Beautiful Artwork", "Sell Items"]
    // const galleries = [purchasedItems ]

    return (
        <>
            <Head>
                <title>My Sell Items</title>
                <link rel="icon" href="/favicon.png" />
            </Head>

            <Header current={-1}></Header>

            <div className='main page-wrap'>
                <div className='relative w-full 2xl:max-w-screen-2xl h-auto pt-[104px] m-auto'>
                    <div className='flex flex-col mx-4 sm:mx-16 lg:mx-[9vw] space-y-6'>

                        <div className='flex flex-col space-y-6'>
                            <h1 className="page-title">My Sell Items</h1>

                            <div className='page-undertitle'>
                                This is a descriptive sub-headline that introduces the whole content of this text to the audience who is interested in reading about this topic.
                            </div>
                            
                            <div className='resell-purchased-wrap flex flex-row items-center'>
                                <div className='like-icon-wrap'>
                                <svg width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M27.6695 12.0191C28.2788 12.4589 29.2615 13.4693 29.2615 13.4693C33.0764 17.0448 38.8223 25.9378 40.6675 30.4496C40.7061 30.4496 41.8004 33.1323 41.8433 34.4083V34.5782C41.8433 36.5336 40.749 38.3627 38.9897 39.299C38.2644 39.6851 36.5002 40.0441 35.6491 40.2173C35.3672 40.2747 35.1855 40.3116 35.1748 40.3225C32.6601 40.7057 28.8024 40.9583 24.5669 40.9583C20.1213 40.9583 16.0961 40.7057 13.6201 40.2354C13.5772 40.2354 11.3157 39.7694 10.5605 39.4689C9.47051 39.0029 8.5479 38.1493 7.96001 37.0867C7.53947 36.2374 7.3335 35.3403 7.3335 34.4083C7.37212 33.4284 8.00292 31.5993 8.29472 30.8764C10.1399 26.1076 16.1777 17.0012 19.8681 13.5129C20.2514 13.1238 20.6877 12.7162 20.9913 12.4326C21.1533 12.2813 21.2774 12.1653 21.3357 12.1062C22.2583 11.3832 23.3912 11 24.6099 11C25.6955 11 26.7855 11.3397 27.6695 12.0191ZM66.8384 37.2599C66.8384 39.1805 65.3065 40.7353 63.4141 40.7353C61.5217 40.7353 59.9897 39.1805 59.9897 37.2599L59.0456 20.4708C59.0456 18.0233 61.0024 16.0417 63.4141 16.0417C65.8257 16.0417 67.7782 18.0233 67.7782 20.4708L66.8384 37.2599ZM77.4398 48.5305C78.5298 49.0009 79.4524 49.8501 80.0403 50.9128C80.4608 51.762 80.6668 52.6592 80.6668 53.5955C80.6282 54.5711 79.9974 56.4046 79.7013 57.1275C77.8604 61.8921 71.8184 70.9986 68.1322 74.4914C67.7555 74.871 67.3276 75.2703 67.0248 75.5528L67.0247 75.5529L67.0243 75.5533L67.0242 75.5534C66.8548 75.7114 66.7247 75.8329 66.6646 75.8938C65.7378 76.6167 64.6092 77 63.3948 77C62.3005 77 61.2105 76.6603 60.3308 75.9765C59.7215 75.541 58.7388 74.5306 58.7388 74.5306C54.9196 70.9594 49.178 62.0619 47.3328 57.55C47.2899 57.55 46.1999 54.8716 46.157 53.5955V53.4257C46.157 51.4659 47.247 49.6367 49.0107 48.7004C49.7345 48.3184 51.4931 47.9584 52.3461 47.7837L52.3467 47.7836C52.6312 47.7254 52.8148 47.6878 52.8255 47.6769C55.3402 47.2937 59.198 47.0411 63.4334 47.0411C67.8791 47.0411 71.9042 47.2937 74.3802 47.764C74.4188 47.764 76.6846 48.23 77.4398 48.5305ZM24.5871 47.2653C22.6947 47.2653 21.1627 48.82 21.1627 50.7406L20.2187 67.5293C20.2187 69.9768 22.1755 71.9583 24.5871 71.9583C26.9988 71.9583 28.9513 69.9768 28.9513 67.5293L28.0115 50.7406C28.0115 48.82 26.4795 47.2653 24.5871 47.2653Z" fill="url(#paint0_linear_197_74)"/>
                                    <defs>
                                    <linearGradient id="paint0_linear_197_74" x1="44.0002" y1="11" x2="44.0002" y2="77" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#4CEBBB"/>
                                    <stop offset="1" stop-color="#4CEBBB" stop-opacity="0"/>
                                    </linearGradient>
                                    </defs>
                                </svg>

                                </div>
                                <div className='resell-purchased__text flex-grow flex-col'>
                                    <p className='text-[#53CEC7] dark:text-gray-600 text-sm font-bold'>You selling {resellItems.length} NFTS</p>
                                </div>
                            </div>

                            {/* galleries */}
                            {
                                isLoading?"ISLaoding":  <ArtGallery5 galleries={resellItems} openPriceModal={openPriceModal} closePriceModal={closePriceModal}>{{cancelSellFucnction:cancelResellNFT}}</ArtGallery5> 

                            }
                        </div>
                    </div>
                </div>
            </div>
            <SuccessDialog show={successOpen} closeSuccessModal={closeSuccessModal}>{{modalIconUrl: "/assets/svg/attention-icon",msg:"Please Connect MetaMask With Polygon NetWork",title:"Attention",buttonTitle:"Cancel"}}</SuccessDialog>
            <LoaderDialog show={loaderOpen} openLoaderModal={openLoaderModal}></LoaderDialog>

            
            <Footer></Footer>

    
        </>
    )
}
