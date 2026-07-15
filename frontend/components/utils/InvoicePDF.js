import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';

export const generateInvoicePDF = async (cart, customer, grandTotal, invoiceNumber) => {
    const today = new Date().toLocaleDateString('en-IN');
    const tableRows = cart.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>
                <div class="item-desc">${item.item_name}</div>
                <div class="qty">Qty: ${item.quantity} ${item.unit || ''}</div>
            </td>
            <td>₹${item.sale_rate}</td>
            <td style="font-weight: bold;">₹${(item.sale_rate * item.quantity).toFixed(2)}</td>
        </tr>
    `).join('');
    const htmlContent = `
    <html>
    <head>
        <style>
            body { 
                font-family: 'Helvetica', sans-serif; 
                padding: 30px; 
                color: #000; 
            }
            .header-container { 
                display: flex; 
                justify-content: space-between; 
                align-items: flex-start; 
            }
            .left-header { 
                flex: 1; 
            }
            .right-header { 
                flex: 1; 
                text-align: right; 
            }
            .title { 
                font-size: 36px; 
                font-weight: 900; 
                margin: 0; 
            }
            .invoice-num { 
                font-size: 18px; 
                color: #333;
                margin-top: 5px; 
            }
            .grand-total { 
                font-size: 20px; 
                margin-top: 40px; 
            }
            
            /* Logo & Brand Styling */
            .brand-name { 
                font-size: 48px; 
                font-weight: 900; 
                letter-spacing: 2px; 
                margin-bottom: 5px; 
            }
            .p { 
                color: #e74c3c; 
            } 
            .y { 
                color: #f1c40f; 
            } 
            .s1 { 
                color: #8cc63f; 
            } 
            .s2 { 
                color: #8cc63f; 
            } 
            .u { 
                color: #e6ba9f; 
            } 
            .m { 
                color: #2c3e50; 
            }
            .company-address { 
                font-size: 12px; 
                line-height: 1.5; 
                color: #333; 
                max-width: 250px; 
                margin-left: auto; 
                text-align: left; 
            }
            
            .details-container { 
                display: flex; 
                justify-content: space-between; 
                margin-top: 50px; 
                font-size: 16px; 
                line-height: 1.6; 
            }
            .billed-to { 
                font-weight: bold; 
                margin-bottom: 5px; 
            }
            
            /* Table Styling */
            table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-top: 40px; 
            }
            th { 
                background-color: #000000; 
                color: #ffffff; 
                padding: 12px; 
                text-align: left; 
            }
            td { 
                padding: 12px; 
                border-bottom: 1px solid #eeeeee; 
            }
            .item-desc { 
                font-weight: bold; 
                font-size: 16px; 
            }
            .qty { 
                font-size: 14px; 
                font-weight: bold; 
                margin-top: 6px; 
            }
        </style>
    </head>
    <body>
        <div class="header-container">
            <div class="left-header">
                <h1 class="title">TAX INVOICE</h1>
                <div class="invoice-num">Invoice#: ${invoiceNumber}</div>
                <div class="grand-total">Grand Total: ₹${grandTotal.toFixed(2)}</div>
            </div>
            <div class="right-header">
                <div class="brand-name">
                    <span class="p">P</span><span class="y">Y</span><span class="s1">S</span><span class="s2">S</span><span class="u">U</span><span class="m">M</span>
                </div>
                <div class="company-address">
                    537/8, Puraniya, Sitapur Road,<br/>
                    Lucknow-226020, Uttar Pradesh,<br/>
                    India
                </div>
            </div>
        </div>

        <div class="details-container">
            <div>
                <div>Invoice Date: ${today}</div>
                <div>Terms: Due to Receipt</div>
                <div>Due Date: ${today}</div>
            </div>
            <div>
                <div class="billed-to">Billed To: ${customer.customer_name}</div>
                <div>Contact Number: ${customer.phone_number}</div>
                <div>Address: ${customer.address || 'N/A'}</div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Item & Description</th>
                    <th>MRP</th>
                    <th>Total Cost</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    </body>
    </html>
    `;

    try {
        // Generates a temporary PDF file on the device
        const { base64 } = await Print.printToFileAsync({ 
            html: htmlContent,
            base64: true 
        });
        const safeFile = new File(Paths.document, `PYSSUM_Invoice_${invoiceNumber}.pdf`);
        await safeFile.write(base64, { encoding: 'base64' });
        await Sharing.shareAsync(safeFile.uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
};