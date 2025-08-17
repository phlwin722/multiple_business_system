import React from 'react'
import Table from '../../components/Table'
import { useState, useEffect } from 'react'

const Product = () => {
    const [rows, setRows] = useState([]);
    const columns = [
        {
            name: 'Product name',
            key: 'product_name'
        },
        {   
            name: 'Price',
            key: 'price'
        },
        {
            name: 'Quantity',
            key: 'quantity'
        },
        {
            name: 'Image',
            key: 'image'
        }
    ];

    const fetchData = async() => {
        try {

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    },[])

    return (
    <div className='p-6'>
        <h1 className='text-2xl font-semibold mb-4'>Product</h1>
        <Table 
            columns={columns}
            rows={rows}
            url={'/product'}
            fetchData={fetchData}
            type={true}
        />
    </div>  
  )
}

export default Product
