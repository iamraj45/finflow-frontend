import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/unsecure/getAllCategories`);
                setCategories(res.data);
            } catch (err) {
                console.error("Error fetching categories", err);
            }
        };

        fetchCategories();
    }, []);

    return (
        <CategoryContext.Provider value={{ categories }}>
            {children}
        </CategoryContext.Provider>
    );
};
