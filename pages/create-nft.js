import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState,useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import Header from '../components/header'
import Footer from '../components/footer'
import { create } from 'ipfs-http-client'
import Breadcrumbs from '../components/breadcrumbs'
import { useWeb3 } from '../components/web3'
import Web3 from "web3"
import LoaderDialog from '../components/dialog/loader'
import SuccessDialog from '../components/dialog/success'

const projectId = '2IHO3L1MzZ4M78u4Qqt6RC8JUVA';
const projectSecret = '3d098177d3f7c9874221d5f7988d5eb4';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const options = {
    host: 'ipfs.infura.io',
    protocol: 'https',
    port: 5001,
    apiPath: '/api/v0',
    headers: {
        authorization: auth,
    },
};
const dedicateEndPoint = 'https://nftrush.infura-ipfs.io/ipfs'
const ipfsClient = create(options);

export default function CreateNftPage() {
    const breadcrumbs = ["Create NFT"]

    const web3Api = useWeb3();
    console.log("Web3 At Create NFt Page",web3Api)
    const account =   web3Api.account;
    //============<

    const[buttonTitle,setButtonTitle]= useState("Please Fill All Fields")


    //Load Contracts Function
    const[nftContract,setNFtContract]= useState(null)
    const[marketContract,setMarketContract]= useState(null)
    const[unsoldItems,setUnsoldItems]= useState([])


    const[isActive,setIsActive]=useState(false)

    const router = useRouter();



    const [urlHash,setUrlHash] = useState()
    const onChange = async(e)=>{
        //e.preventDefault();
        const file = e.target.files[0];
        console.log("before")

        try{
            console.log("after try")
            const addedFile = await ipfsClient.add(file);
            const ipfsUrl = `${dedicateEndPoint}/${addedFile.path}`;
            setUrlHash(ipfsUrl)
            console.log('ipfsUrl:', ipfsUrl)
        }catch(e){
            console.log(e)
        }

    }

    const [nftFormInput,setNftFormInput] =useState({
        price:'',
        name:"",
        description:"",
        category:""
    })

    const createMarketItem =  async()=>{
        const {price,name,description,category}=nftFormInput;
        if(!price||!name||!description||!category ||!urlHash) return
        setButtonTitle("Wait Mint Processing the NFT")
        openLoaderModal()


        const data = JSON.stringify({
            name,description,category,image:urlHash
        });

        try{
            setIsActive(false)
            const addedFile = await ipfsClient.add(data);
            const ipfsUrl = `${dedicateEndPoint}/${addedFile.path}`;
            console.log('ipfsUrl:', ipfsUrl)
            createMarketForSale(ipfsUrl);
        }catch(e){
            console.log(e)
        }


    }

    useEffect(()=>{

        const {price,name,category,description}=nftFormInput;
        if(!price||!name||!description||!category ||!urlHash) {
            setIsActive(false)
        }else{
            setIsActive(true)
        }
    },[nftFormInput,urlHash])


    useEffect(()=>{
        const LoadContracts = async()=>{
            //Paths of Json File

            const netWorkId =  await web3Api.web3.eth.net.getId();





        }
        web3Api.web3&&account&&LoadContracts()

    },[web3Api.web3&&account])


    const createMarketForSale = async(url)=>{
        //Paths of Json File
        const nftContratFile =  await fetch("/abis/NFT.json");
        const marketContractFile = await fetch("/abis/NFTMarketPlace.json");
        //Convert all to json
        const  convertNftContratFileToJson = await nftContratFile.json();
        const  convertMarketContractFileToJson = await marketContractFile.json();
        //Get The ABI
        const markrtAbi = convertMarketContractFileToJson.abi;
        const nFTAbi = convertNftContratFileToJson.abi;

        const netWorkId =  await  web3Api.web3.eth.net.getId();

        const nftNetWorkObject =  convertNftContratFileToJson.networks[netWorkId];
        const nftMarketWorkObject =  convertMarketContractFileToJson.networks[netWorkId];

        if(nftMarketWorkObject && nftMarketWorkObject){
            const nftAddress = nftNetWorkObject.address;
            const marketAddress = nftMarketWorkObject.address;

            const deployedNftContract = await new web3Api.web3.eth.Contract(nFTAbi,nftAddress);
            setNFtContract(deployedNftContract)
            const deployedMarketContract = await new web3Api.web3.eth.Contract(markrtAbi,marketAddress);
            setMarketContract(deployedMarketContract)

            if(account){
                //Start to create NFt Item Token To MarketPlace
                openLoaderModal()
                let createTokenResult  = await deployedNftContract.methods.createNFtToken(url).send({from:account})

                const tokenid = createTokenResult.events.Transfer.returnValues["2"]

                console.log(tokenid)

                setIsActive(false)
                setButtonTitle("Wait Add the NFT to Your MarketPlace")

                let marketFees = await deployedMarketContract.methods.gettheMarketFees().call()
                marketFees =marketFees.toString()



                const priceToWei = Web3.utils.toWei(nftFormInput.price,"ether")

                openLoaderModal()
                const lanchTheNFtForSale = await deployedMarketContract.methods.createItemForSale(nftAddress,tokenid,priceToWei).send({from:account,value:marketFees})

                if(lanchTheNFtForSale){
                    router.push("/")


                }
            } else{
                window.alert(" UNlock Your Wallet Or Please install any provider wallet like MetaMask")

            }





        }else{
            window.alert("You are at Wrong Netweok, Connect with Cronos Please")
        }









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
        <>
            <Head>
                <title>Mint NFT</title>
                <link rel="icon" href="/favicon.png" />
            </Head>

            <Header current={2}></Header>

            <div className='main page-wrap'>
                <div className='w-full 2xl:max-w-screen-2xl h-auto pt-[104px] m-auto'>
                    <div className='relative flex flex-col mx-4 sm:mx-12 lg:mx-[9vw] space-y-6 text-white dark:text-gray-800'>
                        <h1 className='page-title'>Create Your NFT</h1>
                        <p className='page-undertitle'>This is a descriptive sub-headline that introduces the whole content of this text to the audience who is interested in reading about this topic.</p>
                        <div className='create-page-wrap flex flex-col lg:flex-row items-center'>
                            {/* left input element */}
                            <div className='create-form-wrap relative w-full lg:w-[45%] flex-none flex flex-col space-y-4'>
                                {/* file chooser */}
                                <div className='dragdrop__wrap'>
                                    <label className='dragdrop__label h-full flex flex-col text-center p-2 cursor-pointer'>
                                        <div className='dragdrop__img-wrap'>
                                            {
                                                urlHash?    <img className="dragdrop__loaded-img object-fit svg-inline--fa fa-image " width="60" src={urlHash} alt="preview image"/> :
                                                <img src="/assets/svg/img-icon.svg" alt="" className='dragdrop__img w-full h-auto object-cover'></img>
                                            }
                                        </div>
                                        <div className='dragdrop__info'>
                                            <span className="dragdrop__text-1 flex-1 text-xs leading-normal">Drag and Drop File</span>
                                            <span className="dragdrop__text-2 flex-1 text-xs leading-normal">Browse Media on Your Device</span>
                                            <span className="dragdrop__text-3 flex-1 text-[8px] leading-normal">JPG, PNG, GIF, SVG, WEBM, MP3, MP4. Max 100mb.</span>
                                        </div>
                                        <input type='file' className="hidden" id="file-chooser" onChange={onChange} />
                                    </label>
                                </div>
                                <div className='create__inputs-wrap'>
                                    <input className='my-input' placeholder='NFT Title' id="nft-title"
                                        onChange = {e=>setNftFormInput({...nftFormInput,name:e.target.value})}
                                    >
                                    </input>

                                    <select className='my-input appearance-none custom-select' placeholder='NFT Title' defaultValue={0} id="nft-category" onChange={e=>setNftFormInput({...nftFormInput,category:e.target.value})}>
                                        <option value="0" disabled>Choose Category</option>
                                        <option value="ART">ART</option>
                                        <option value="COLLECTIBLES">COLLECTIBLES</option>
                                        <option value="PHOTOGRAPHY">PHOTOGRAPHY</option>
                                        <option value="SPORT">SPORT</option>
                                        <option value="TRADING CARDS">TRADING CARDS</option>
                                        <option value="UTILITY">UTILITY</option>
                                        <option value="VIRTUAL WORDS">VIRTUAL WORDS</option>
                                    </select>

                                    <div className='relative text-[#B4BAEF]'>
                                        <input className='my-input my-input_price' type="number" min={0}  placeholder='Price' id="nft-price"
                                            onChange = {e=>setNftFormInput({...nftFormInput,price:e.target.value})}></input>
                                        <img src="/assets/svg/assets-logo.svg" alt="Polygon NFT" className='input-price__value'></img>
                                    </div>
                                    <textarea className='my-textarea' rows="6" placeholder='Desription'
                                            onChange ={e=>setNftFormInput({...nftFormInput,description:e.target.value})}>
                                    </textarea>
                                </div>
                                {isActive?                                <button className='my-button rounded-full bg-gradient-to-b from-[#3461FF] to-[#8454EB] text-white text-base px-6 sm:px-10 py-2 shadow-md m-auto' id="btn-create-nft" onClick={createMarketItem}>Create</button>
                                    :<button className='my-button' id="btn-create-nft" >{buttonTitle}</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <LoaderDialog show={loaderOpen} openLoaderModal={openLoaderModal}></LoaderDialog>

            <Footer></Footer>

        </>
    )
}
