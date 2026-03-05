import React from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    return (
        <div className="cart-item-container flex items-center gap-6 p-6 rounded-friendly bg-timberwolf dark:bg-walnut shadow-xl group border border-black-pearl/10 dark:border-rose-fog/5 transition-colors duration-500">
            <img
                alt={item.artist}
                className={`w-32 h-32 object-cover rounded-xl shadow-lg ${item.grayscale ? 'grayscale group-hover:grayscale-0 transition-all' : ''}`}
                src={item.image}
            />
            <div className="flex-grow flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="serif-font text-2xl font-bold text-black-pearl dark:text-rose-fog">{item.artist}</h3>
                    <p className="text-black-pearl/70 dark:text-rose-fog/70 italic">{item.title}</p>
                </div>
                <div className="flex items-center gap-8">
                    <div className="flex items-center border border-black-pearl/20 dark:border-rose-fog/20 rounded-full px-4 py-1">
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="text-black-pearl dark:text-rose-fog hover:text-black-pearl/70 dark:hover:text-white-berry transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="mx-4 font-bold text-black-pearl dark:text-rose-fog">{item.quantity}</span>
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="text-black-pearl dark:text-rose-fog hover:text-black-pearl/70 dark:hover:text-white-berry transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                    </div>
                    <span className="serif-font text-2xl font-bold text-black-pearl dark:text-rose-fog">${(item.price * item.quantity).toFixed(2)}</span>
                    <button
                        onClick={() => onRemove(item.id)}
                        className="text-black-pearl/40 dark:text-rose-fog/40 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
