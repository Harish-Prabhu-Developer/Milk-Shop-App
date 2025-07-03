type BranchType = "NKC Local" | "NKC OUT" | "AKC Local" | "AKC OUT";

interface BranchDataType {
  id: string;
  type: BranchType;
  "Branch Name": string;
  Phone: string;
  Location: string;
}


const BranchData:BranchDataType[] =[
    {
        id: "1",
        type: "NKC Local",
        "Branch Name": "KALLIKUPPAM NKC",
        Phone:"8248443178",
        Location:"Local NKC",
    },
    {
        id: "2",
        type: "NKC Local",
        "Branch Name": "PONNERI INSIDE",
        Phone:"9884859309",
        Location:"Local NKC",
    },
    {
        id: "3",
        type: "NKC Local",
        "Branch Name": "MMDA",
        Phone:"9940559972",
        Location:"Local NKC",
    },
    {
        id: "4",
        type: "NKC Local",
        "Branch Name": "EKKADUTHANGAL",
        Phone:"9790991083",
        Location:"Local NKC",
    },
    {
        id: "5",
        type: "NKC Local",
        "Branch Name": "ADAMBAKKAM",
        Phone:"9791314122",
        Location:"Local NKC",
    },
    //NKC OUT Data
    {
        id: "6",
        type: "NKC OUT",
        "Branch Name": "PONDICHERY MOOLAKULAM",
        Phone:"9840733663",
        Location:"Out NKC",
    },
    
    {
        id: "7",
        type: "NKC OUT",
        "Branch Name": "CUDDALORE",
        Phone:"9698937475",
        Location:"Out NKC",
    },
    
    {
        id: "8",
        type: "NKC OUT",
        "Branch Name": "NEYVELI",
        Phone:"7010486417",
        Location:"Out NKC",
    },

    //AKC LOCAL Data
    {
        id: "9",
        type: "AKC Local",
        "Branch Name": "KOVALAM FOOT COURT",
        Phone:"9841484902",
        Location:"AKC LOCAL",
    },
    {
        id: "10",
        type: "AKC Local",
        "Branch Name": "PONNERI INSIDE",
        Phone:"9884859309",
        Location:"AKC LOCAL",
    },
    {
        id: "11",
        type: "AKC Local",
        "Branch Name": "MMDA",
        Phone:"9940559972",
        Location:"AKC LOCAL",
    },
    {
        id: "12",
        type: "AKC Local",
        "Branch Name": "EKKADUTHANGAL",
        Phone:"9790991083",
        Location:"AKC LOCAL",
    },
    {
        id: "13",
        type: "AKC Local",
        "Branch Name": "ADAMBAKKAM",
        Phone:"9791314122",
        Location:"AKC LOCAL",
    },

    //AKC OUT Data
    {
        id: "14",
        type: "AKC OUT",
        "Branch Name": "SAMAYAPURAM",
        Phone:"9944707529",
        Location:"AKC OUT",
    },
    
    {
        id: "15",
        type: "AKC OUT",
        "Branch Name": "CUDDALORE",
        Phone:"9698937475",
        Location:"AKC OUT",
    },
    
    {
        id: "16",
        type: "AKC OUT",
        "Branch Name": "NEYVELI",
        Phone:"7010486417",
        Location:"AKC OUT",
    },

]

export default BranchData;