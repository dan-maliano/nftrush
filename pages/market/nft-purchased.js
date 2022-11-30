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
import ArtGallery4 from '../../components/explore/art-gallery4'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { TailSpin } from  'react-loader-spinner'
import Web3 from "web3"
import axios from 'axios'
import { useRouter } from 'next/router'
import SuccessDialog from '../../components/dialog/success'
import LoaderDialog from '../../components/dialog/loader'
import { useWeb3 } from '../../components/web3'
export default function NftPurchasedPage() {

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
            //Paths of Json File
            openLoaderModal()
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
      





            console.log(account);
            //Fetch all unsold items
            const data =  await deployedMarketContract.methods.getMyNFTPurchased().call({from:account})

            console.log(data)
               const items = await Promise.all(data.map(async item=>{
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
                buttonTitle:"Process To Resell"
            }
            console.log(item)

            return myItem;
              }));
              

              setpurchasedItems(items);
              SetIsLoading(false)
              closeLoaderModal()

           
           }else{
              openSuccessModal()
           }


        }
        web3Api.web3&&account&&LoadContracts()

    },[account])
    //Resell Function

    const resellItemFunction = async(item,newPrice)=>{
      console.log(marketContract)
      console.log(nftAddress)


      if(marketContract){

        let marketFees = await marketContract.methods.gettheMarketFees().call()
        marketFees =marketFees.toString()
        const priceToWei = Web3.utils.toWei(newPrice,"ether")
        console.log(priceToWei);

      
   
        try{
            closePriceModal()
          await marketContract.methods.putItemToResell(nftAddress,item.itemId,priceToWei).send({from:account, value:marketFees});
          console.log("Resell NFt")
          router.push("/")

         }catch(e){
           console.log(e)

         }
       }

      
    
      
    }
    let [priceOpen, setPriceOpen] = useState(false)
    let inputPriceRef = useRef(null)
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
    }



const breadcrumbs = ["Explore", "Beautiful Artwork", "Purchased Items"]


return (
    <>
        <Head>
            <title>Purchased Items</title>
            <link rel="icon" href="/favicon.png" />
        </Head>

        <Header current={-1}></Header>

        <div className='main page-wrap'>
            <div className='relative w-full 2xl:max-w-screen-2xl h-auto pt-[104px] m-auto'>
                <div className='flex flex-col mx-4 sm:mx-16 lg:mx-[9vw] space-y-6'>
                    <div className='flex flex-col space-y-6'>
                        <h1 className="page-title">Purchased Items</h1>
                        <div className='page-undertitle'>
                            This is a descriptive sub-headline that introduces the whole content of this text to the audience who is interested in reading about this topic.
                        </div>
                        <div className='resell-purchased-wrap flex flex-row items-center space-x-4'>
                            <div className='like-icon-wrap'>
                            <svg width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M51.778 41.1881H61.9268C63.4656 41.1881 64.6746 39.9159 64.6746 38.3817C64.6746 36.8102 63.4656 35.5753 61.9268 35.5753H51.778C50.2392 35.5753 49.0301 36.8102 49.0301 38.3817C49.0301 39.9159 50.2392 41.1881 51.778 41.1881ZM73.9807 21.7342C76.2156 21.7342 77.6811 22.52 79.1467 24.2412C80.6122 25.9625 80.8687 28.4321 80.5389 30.6735L77.0583 55.2201C76.3988 59.9386 72.4419 63.4148 67.7889 63.4148H27.8167C22.9438 63.4148 18.9136 59.6019 18.5106 54.6626L15.1399 13.8725L9.60753 12.8996C8.14201 12.6377 7.11614 11.1784 7.37261 9.68163C7.62908 8.15121 9.05796 7.13716 10.5601 7.36541L19.2983 8.70874C20.544 8.937 21.46 9.98098 21.5699 11.2532L22.266 19.635C22.3759 20.8361 23.3285 21.7342 24.5009 21.7342H73.9807ZM27.2297 69.3289C24.1521 69.3289 21.6607 71.8733 21.6607 75.0165C21.6607 78.1222 24.1521 80.6667 27.2297 80.6667C30.2707 80.6667 32.7621 78.1222 32.7621 75.0165C32.7621 71.8733 30.2707 69.3289 27.2297 69.3289ZM68.4476 69.3289C65.37 69.3289 62.8786 71.8733 62.8786 75.0165C62.8786 78.1222 65.37 80.6667 68.4476 80.6667C71.4886 80.6667 73.98 78.1222 73.98 75.0165C73.98 71.8733 71.4886 69.3289 68.4476 69.3289Z" fill="url(#paint0_linear_196_49)"/>
                                <defs>
                                    <linearGradient id="paint0_linear_196_49" x1="43.9999" y1="7.33337" x2="43.9999" y2="80.6667" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#4CEBBB"/>
                                        <stop offset="1" stop-color="#4CEBBB" stop-opacity="0"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                            </div>
                            <div className='resell-purchased__text flex-grow flex-col'>
                              {!purchasedItems?  <p className='text-[#53CEC7] dark:text-gray-600 text-sm font-bold'>You Purchased {purchasedItems.length} NFTS</p>: <p className='text-[#53CEC7] dark:text-gray-600 text-sm font-bold'>Start To Purchased Items Now</p>}
                            </div>
                        </div>

                        {/* galleries */}
                        <ArtGallery4 galleries={purchasedItems}  closePriceModal={closePriceModal}>{{resellFucnction:resellItemFunction}}</ArtGallery4> 
                        <SuccessDialog show={successOpen} closeSuccessModal={closeSuccessModal}>{{modalIconUrl: "/assets/svg/attention-icon",msg:"Please Connect MetaMask With Polygon NetWork",title:"Attention",buttonTitle:"Cancel"}}</SuccessDialog>
                        <LoaderDialog show={loaderOpen} openLoaderModal={openLoaderModal}></LoaderDialog>

                    </div>
                </div>
            </div>
        </div>
        
        <Footer></Footer>

    </>
)
}
