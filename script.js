document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    const yearElement =
        document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent =
            new Date().getFullYear();
    }


    /* =====================================================
       GITHUB SETTINGS
    ===================================================== */

    const GITHUB_OWNER =
        "manishhaatwa-dot";

    const GITHUB_REPO =
        "SR-mobile-and-repairing";

    const GITHUB_BRANCH =
        "main";


    /* =====================================================
       PRODUCT FOLDERS
    ===================================================== */

    const categories = {

        mobile:
            "mobile-products",

        accessories:
            "accessories-products",

        covers:
            "covers-products",

        repairing:
            "repairing-products"

    };


    /* =====================================================
       IMAGE EXTENSIONS
    ===================================================== */

    const imageExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".gif"
    ];


    /* =====================================================
       LOAD PRODUCTS
    ===================================================== */

    async function loadProducts() {

        for (const category in categories) {

            const container =
                document.getElementById(
                    categories[category]
                );


            if (!container) {
                continue;
            }


            try {

                const apiUrl =
                    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/assets/products/${category}?ref=${GITHUB_BRANCH}`;


                const response =
                    await fetch(apiUrl, {
                        cache: "no-store"
                    });


                if (!response.ok) {

                    throw new Error(
                        `GitHub API Error: ${response.status}`
                    );

                }


                const files =
                    await response.json();


                const images =
                    files.filter(file => {

                        return (
                            file.type === "file" &&
                            imageExtensions.some(ext =>
                                file.name
                                    .toLowerCase()
                                    .endsWith(ext)
                            )
                        );

                    });


                renderProducts(
                    container,
                    images
                );


            } catch (error) {

                console.error(
                    `Error loading ${category}:`,
                    error
                );


                container.innerHTML = `
                    <div class="empty-collection">

                        <i class="fa-regular fa-images"></i>

                        <p>
                            Collection coming soon
                        </p>

                    </div>
                `;

            }

        }

    }


    /* =====================================================
       RENDER PRODUCTS
    ===================================================== */

    function renderProducts(
        container,
        images
    ) {

        container.innerHTML = "";


        if (!images.length) {

            container.innerHTML = `
                <div class="empty-collection">

                    <i class="fa-regular fa-images"></i>

                    <p>
                        Collection coming soon
                    </p>

                </div>
            `;

            return;

        }


        images.forEach(file => {


            const card =
                document.createElement("div");

            card.className =
                "product-card";


            const imageWrap =
                document.createElement("div");

            imageWrap.className =
                "product-image-wrap";


            const image =
                document.createElement("img");

            image.className =
                "product-image";


            image.src =
                file.download_url;


            image.loading =
                "lazy";


            image.decoding =
                "async";


            /* =============================================
               FILE NAME → PRODUCT NAME
            ============================================= */

            let productName =
                file.name
                    .replace(/\.[^/.]+$/, "")
                    .replace(/[-_]+/g, " ")
                    .replace(/\s+/g, " ")
                    .trim();


            /*
             * First letter capital
             * Hindi filename भी वैसे ही रहेगा
             */

            if (/^[a-zA-Z]/.test(productName)) {

                productName =
                    productName.replace(
                        /\b[a-z]/g,
                        letter =>
                            letter.toUpperCase()
                    );

            }


            image.alt =
                `${productName} - SR Mobile Shop & Repairing Pali`;


            /* =============================================
               IMAGE ERROR
            ============================================= */

            image.onerror = () => {

                imageWrap.innerHTML = `
                    <div style="
                        width:100%;
                        height:100%;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        color:#0078d4;
                        background:#eef8ff;
                        font-size:35px;
                    ">

                        <i class="fa-regular fa-image"></i>

                    </div>
                `;

            };


            imageWrap.appendChild(
                image
            );


            /* =============================================
               PRODUCT NAME
            ============================================= */

            const name =
                document.createElement("div");

            name.className =
                "product-name";


            name.textContent =
                productName;


            card.appendChild(
                imageWrap
            );


            card.appendChild(
                name
            );


            container.appendChild(
                card
            );

        });

    }


    /* =====================================================
       START
    ===================================================== */

    loadProducts();

});
