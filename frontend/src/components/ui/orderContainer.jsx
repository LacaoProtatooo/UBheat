import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    IconButton,
    Paper
} from '@mui/material';
import PackageIcon from '@mui/icons-material/Inventory';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import PaymentIcon from '@mui/icons-material/Payment';
import { DeleteOutline, DeliveryDiningOutlined, ReviewsOutlined } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { cancelOrder } from '../store/utilitiesSlice';
import ReviewModal from './reviewModal';
import { useState } from 'react';
import { useEffect } from 'react';                                                                  
const OrderContainer = ({ order }) => {
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('user'));
    const id = user ? user._id : null;
    const handleCancelOrder = (id, oid) => {
        dispatch(cancelOrder({ id, orderid: oid }));
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderid, setorderid] = useState(null);
    useEffect(() => {
        if (order) {
            setorderid(order._id);
        }
    }, [order]);
    return (
        <Card sx={{ width: '100%', maxWidth: 1200, margin: 'auto', mt: 2 }}>
            
            <CardContent>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ pb: 2, borderBottom: 1, borderColor: 'divider' }}
                >
                    <Typography variant="h5" component="h2" gutterBottom>
                        Order Details
                    </Typography>
                   {order.status === 'pending' && (
                     <IconButton
                     onClick={() => handleCancelOrder( id, order._id)}
                 >
                     <DeleteOutline sx={{ color: 'red' }} />
                 </IconButton>
                   )}
                </Box>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={3}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <PackageIcon color="primary" />
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Order ID
                                </Typography>
                                <Typography variant="body1">{order._id}</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <CalendarIcon color="primary" />
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Order Date
                                </Typography>
                                <Typography variant="body1">
                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <PaymentIcon color="primary" />
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Order Total
                                </Typography>
                                <Typography variant="body1">
                                    ${order.totalPrice.toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <DeliveryDiningOutlined color="primary" />
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Status
                                </Typography>
                                <Typography variant="body1">{order.status}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
                    Order Items
                </Typography>

                <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Grid container spacing={3}>
                        {order.orderItems && order.orderItems.length > 0 ? (
                            order.orderItems.map((item, index) => (
                                <React.Fragment key={index} >
                                     <ReviewModal 
                                    isOpen={isModalOpen} 
                                    onClose={() => setIsModalOpen(false)}
                                    figurine={item.figurine}
                                    orderid = {orderid}
                                    />
                                    <Grid item xs={12} md={3}>
                                        <Typography variant="body2" color="text.secondary">
                                            Product
                                        </Typography>
                                        <Typography variant="body1">{item.figurine.name}</Typography>
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <Typography variant="body2" color="text.secondary">
                                            Quantity
                                        </Typography>
                                        <Typography variant="body1">{item.qty}</Typography>
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <Typography variant="body2" color="text.secondary">
                                            Price
                                        </Typography>
                                        <Typography variant="body1">${(item.figurine.price * item.qty).toFixed(2)}</Typography>
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <Typography variant="body2" color="text.secondary">
                                            Review:
                                        </Typography>
                                        {(order.status === 'delivered' || order.status === 'completed')? (
                                            // {order._id ===}
                                            <IconButton
                                            onClick={() => setIsModalOpen(true)}>
                                            <ReviewsOutlined 
                                            sx={{ color: 'green' }} 
                                            
                                            />
                                                
                                            </IconButton>
                                            
                                            
                                        ):(
                                            <Typography variant="body1">Finish the delivery</Typography>
                                        )}
                                        
                                    </Grid>
                               
                                </React.Fragment>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Typography variant="body1" color="text.secondary">
                                    No items found in this order.
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            </CardContent>
           
        </Card>
        
    );
};

export default OrderContainer;
