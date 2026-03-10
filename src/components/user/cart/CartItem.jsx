import React from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    return (
        <div className="cart-item-container p-4 md:p-6 rounded-friendly bg-timberwolf dark:bg-walnut shadow-xl group border border-black-pearl/10 dark:border-rose-fog/5 transition-colors duration-500">
            {/* Main row: cover + info */}
            <div className="flex items-start gap-4">
                {/* Cover */}
                <div className="relative aspect-square w-20 sm:w-28 md:w-32 bg-[#E1C2B3]/20 dark:bg-black/30 overflow-hidden shrink-0 rounded-sm">
                    <img
                        src={item.cover_image_url || item.image || "https://picsum.photos/400"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>

                {/* Info + controls */}
                <div className="flex-grow min-w-0">
                    {/* Artist & title */}
                    <h3 className="serif-font text-lg md:text-2xl font-bold text-black-pearl dark:text-rose-fog truncate">
                        {item.artist}
                    </h3>
                    <p className="text-black-pearl/70 dark:text-rose-fog/70 italic text-sm md:text-base truncate">
                        {item.title}
                    </p>

                    {/* Controls row: quantity + price + delete */}
                    <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                        {/* Quantity stepper */}
                        <div className="flex items-center border border-black-pearl/20 dark:border-rose-fog/20 rounded-full px-3 py-1">
                            <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                className="text-black-pearl dark:text-rose-fog hover:text-black-pearl/70 dark:hover:text-white-berry transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">remove</span>
                            </button>
                            <span className="mx-3 font-bold text-black-pearl dark:text-rose-fog text-sm">{item.quantity}</span>
                            <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="text-black-pearl dark:text-rose-fog hover:text-black-pearl/70 dark:hover:text-white-berry transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">add</span>
                            </button>
                        </div>

                        {/* Price + delete */}
                        <div className="flex items-center gap-3">
                            <span className="serif-font text-xl md:text-2xl font-bold text-black-pearl dark:text-rose-fog">
                                ${(item.price * item.quantity).toFixed(2)}
                            </span>
                            <button
                                onClick={() => onRemove(item.id)}
                                className="text-black-pearl/40 dark:text-rose-fog/40 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">delete</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;