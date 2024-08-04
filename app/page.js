"use client"
import { useState, useEffect } from "react"
import { firestore } from "@/firebase"
import { Box, Typography, Button, Modal, Stack, TextField } from "@mui/material"
import { collection, getDocs, query, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore"
import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#003366',
    },
  },
  typography: {
    fontFamily: '"Indie Flower", cursive',
    h4: {
      fontSize: '2rem', 
    },
    h5: {
      fontSize: '1.5rem', 
      color: '#003366',
    },
    h6: {
      fontSize: '1.25rem',
      color: '#003366',
    },
    body1: {
      fontSize: '1rem',
      color: '#003366',
    }
  },
})

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #003366',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  borderRadius: '16px',
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState("")
  const [newItemName, setNewItemName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [updateOpen, setUpdateOpen] = useState(false)
  const [itemToUpdate, setItemToUpdate] = useState("")

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id, ...doc.data()
      })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }

    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const updateName = async (oldName, newName) => {
    const oldDocRef = doc(collection(firestore, "inventory"), oldName)
    const newDocRef = doc(collection(firestore, "inventory"), newName)
    const oldDocSnap = await getDoc(oldDocRef)

    if (oldDocSnap.exists()) {
      const data = oldDocSnap.data()
      await setDoc(newDocRef, data)
      await deleteDoc(oldDocRef)
      await updateInventory()
    } else {
      console.error("Error: Document does not exist.")
    }
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleUpdateOpen = (name) => {
    setItemToUpdate(name)
    setUpdateOpen(true)
  }
  const handleUpdateClose = () => setUpdateOpen(false)

  return (
    <ThemeProvider theme={theme}>
      <Box
        width="100vw"
        height="100vh"
        display={'flex'}
        justifyContent={'center'}
        flexDirection={'column'}
        alignItems={'center'}
        gap={2}
        sx={{ background: '#FFFFFF' }}
      >
        <Box 
          width="100%" 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          padding={2} 
          bgcolor={'#003366'} 
          position="fixed" 
          top={0} 
          zIndex={1000}
          
        >
          <Typography variant="h4" color="white">
            Inventory Management
          </Typography>
        </Box>
        <Box flex={1} mt={8} width="100%" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Add Item
              </Typography>
              <Stack width="100%" direction={'row'} spacing={2}>
                <TextField
                  id="outlined-basic"
                  label="Item"
                  variant="outlined"
                  fullWidth
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
                <Button
                  variant="outlined"
                  onClick={() => {
                    addItem(itemName)
                    setItemName('')
                    handleClose()
                  }}
                >
                  Add
                </Button>
              </Stack>
            </Box>
          </Modal>

          <Modal
            open={updateOpen}
            onClose={handleUpdateClose}
            aria-labelledby="update-modal-title"
            aria-describedby="update-modal-description"
          >
            <Box sx={style}>
              <Typography id="update-modal-title" variant="h6" component="h2">
                Edit Item Name
              </Typography>
              <Stack width="100%" direction={'row'} spacing={2}>
                <TextField
                  id="outlined-basic"
                  label="New Item Name"
                  variant="outlined"
                  fullWidth
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
                <Button
                  variant="outlined"
                  onClick={() => {
                    updateName(itemToUpdate, newItemName)
                    setNewItemName('')
                    handleUpdateClose()
                  }}
                >
                  Update
                </Button>
              </Stack>
            </Box>
          </Modal>

          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add New Item
          </Button>
          <Box border={'1px solid #333'} mt={2} borderRadius="16px">
            <Box
              width="800px"
              height="100px"
              bgcolor={'#003366'}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              borderRadius="16px 16px 0 0"
            >
              <Typography variant={'h4'} color={'#fff'} textAlign={'center'}>
                Inventory Items
              </Typography>
            </Box>
            <Box padding={2} width="800px">
              <TextField
                id="search-bar"
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                InputLabelProps={{
                  style: { textAlign: 'left' }
                }}
                inputProps={{
                  style: { textAlign: 'left' }
                }}
              />
            </Box>
            <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
              {inventory.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).map(({ name, quantity }) => (
                <Box
                  key={name}
                  width="100%"
                  minHeight="150px"
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  bgcolor={'#f9f9f9'}
                  paddingX={3}
                  boxShadow={1}
                  borderRadius={2}
                >
                  <Typography variant={'h4'} textAlign={'center'} flex={1}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant={'h4'} textAlign={'center'} flex={1}>
                    {quantity}
                  </Typography>
                  <Button variant="contained" onClick={() => removeItem(name)} style={{ margin: '0 8px', borderRadius: '8px' }}>
                    Remove
                  </Button>
                  <Button variant="contained" onClick={() => handleUpdateOpen(name)} style={{ margin: '0 8px', borderRadius: '8px' }}>
                    Edit
                  </Button>
                  <Button variant="contained" onClick={() => addItem(name)} style={{ margin: '0 8px', borderRadius: '8px' }}>
                    Add
                  </Button>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )}