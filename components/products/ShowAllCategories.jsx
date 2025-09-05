import React, { useEffect, useState } from 'react'
import Link from "next/link";

function ShowAllCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCategory, setOpenCategory] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
          try {
            setLoading(true);
            const response = await fetch('https://qistbackend-1.onrender.com/api/categories', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
    
            if (!response.ok) {
              throw new Error(response.status === 401 ? 'Unauthorized' : 'Failed to fetch categories');
            }
    
            const data = await response.json();
            setCategories(data);
          } catch (error) {
            console.error(error.message === 'Unauthorized' ? 'Please log in to access categories' : 'Failed to fetch categories');
          } finally {
            setLoading(false);
          }
        };
        fetchCategories();
      }, []);
    
      const toggleDropdown = (categoryId) => {
        setOpenCategory(openCategory === categoryId ? null : categoryId);
      };


  return (
    <div className="facet-categories select-none">
    <h6 className="title fw-medium">Show all categories</h6>
    {loading ? (
        <div className="loading-cs">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
    ) : (
        <ul className="menu-category-list">
        {categories.map((category) => (
            <li key={category.id} className="menu-item">
            <div
                className="px-3 all-category-cs"
                onClick={() => category.subcategories.length > 0 && toggleDropdown(category.id)}
            >
                <Link
                href={`/product-category/${category.slugName}`}
                className="item-link body-text-3 flex-grow"
                >
                {category.name}
                </Link>
                {category.subcategories.length > 0 && (
                <i
                    className={`icon-arrow-down ${openCategory === category.id ? '' : 'rotate-90-neg'} text-gray-600`}
                />
                )}
            </div>
            {category.subcategories.length > 0 && openCategory === category.id && (
                <div className="sub-menu-container ml-4">
                <ul className="sub-menu-list">
                    {category.subcategories.map((subcategory) => (
                    <li key={subcategory.id} className="sub-menu-item py-1 px-3">
                        <Link
                            href={`/product-category/${category.slugName}/${subcategory.slugName}`}
                            className="body-text-3 link transition-colors"
                        >
                        {subcategory.name}
                        </Link>
                    </li>
                    ))}
                </ul>
                </div>
            )}
            </li>
        ))}
        {categories.length === 0 && !loading && (
            <li className="menu-item">
            <span className="body-text-3">No categories available</span>
            </li>
        )}
        </ul>
    )}
    </div>
  )
}

export default ShowAllCategories