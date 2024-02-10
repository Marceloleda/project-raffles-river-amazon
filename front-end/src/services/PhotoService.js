export const PhotoService = {
    getData() {
        return [
            {
                itemImageSrc: 'https://storage.googleapis.com/pictures-from-raffles/acer1.jpg',
                thumbnailImageSrc: 'https://storage.googleapis.com/pictures-from-raffles/acer1.jpg',
                alt: 'Description for Image 1',
                title: 'Title 1'
            },
            {
                itemImageSrc: 'https://storage.googleapis.com/pictures-from-raffles/acer2.jpg',
                thumbnailImageSrc: 'https://storage.googleapis.com/pictures-from-raffles/acer2.jpg',
                alt: 'Description for Image 2',
                title: 'Title 2'
            },
            {
                itemImageSrc: 'https://storage.googleapis.com/pictures-from-raffles/acer3.webp',
                thumbnailImageSrc: 'https://storage.googleapis.com/pictures-from-raffles/acer3.webp',
                alt: 'Description for Image 3',
                title: 'Title 3'
            },
            {
                itemImageSrc: 'https://storage.googleapis.com/pictures-from-raffles/WhatsApp%20Image%202023-12-31%20at%2019.43.40.jpeg',
                thumbnailImageSrc: 'https://storage.googleapis.com/pictures-from-raffles/WhatsApp%20Image%202023-12-31%20at%2019.43.40.jpeg',
                alt: 'Description for Image 4',
                title: 'Title 4'
            },
            // {
            //     itemImageSrc: 'https://primefaces.org/cdn/primereact/images/galleria/galleria5.jpg',
            //     thumbnailImageSrc: 'https://primefaces.org/cdn/primereact/images/galleria/galleria5s.jpg',
            //     alt: 'Description for Image 5',
            //     title: 'Title 5'
            // }
        ];
    },

    getImages() {
        return Promise.resolve(this.getData());
    }
};

