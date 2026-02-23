import React, { useState, useEffect, useCallback } from 'react';
import { 
    Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, 
    ListItemButton, ListItemIcon, ListItemText, Container, 
    Grid, Paper, InputBase, Button, Avatar, Menu, MenuItem, CssBaseline, 
    Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, Snackbar, Alert, Chip,
    Breadcrumbs, Link as MuiLink
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import FilterListIcon from '@mui/icons-material/FilterList';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { getProjects, createProject, deleteProject, updateProject } from './api';
import axios from 'axios';

// --- 테마 설정 (청록색 + 회색 조합) ---
const theme = createTheme({
    palette: {
        primary: {
            main: '#009688', // 청록색 (Teal)
        },
        secondary: {
            main: '#607d8b', // 회색 (Blue Grey)
        },
        background: {
            default: '#f4f6f8', // 밝은 회색 배경
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Pretendard", "Roboto", "Helvetica", "Arial", sans-serif',
        h6: {
            fontWeight: 700,
        },
    },
    shape: {
        borderRadius: 12, // 둥글게
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // 대문자 자동 변환 끄기
                },
            },
        },
    },
});

const drawerWidth = 260;

// --- 상단 헤더 & 사이드바 컴포넌트 ---
function Layout({ children }) {
    const [openDrawer, setOpenDrawer] = useState(true);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleDrawer = () => {
        setOpenDrawer(!openDrawer);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const menuItems = [
        { text: '프로젝트 목록', icon: <DashboardIcon />, path: '/' },
        { text: '사용자 관리', icon: <PeopleIcon />, path: '/users' },
        { text: '설정', icon: <SettingsIcon />, path: '/settings' },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            
            {/* 상단 헤더 (AppBar) */}
            <AppBar position="absolute" open={openDrawer} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar sx={{ pr: '24px' }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{ marginRight: '36px', ...(openDrawer && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                        API Document Manager
                    </Typography>
                    <IconButton color="inherit">
                        <NotificationsIcon />
                    </IconButton>
                    <IconButton color="inherit" onClick={handleOpenUserMenu} sx={{ ml: 1 }}>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>H</Avatar>
                    </IconButton>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        keepMounted
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <MenuItem onClick={handleCloseUserMenu}><Typography textAlign="center">프로필</Typography></MenuItem>
                        <MenuItem onClick={handleCloseUserMenu}><Typography textAlign="center">로그아웃</Typography></MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* 왼쪽 사이드바 (Drawer) */}
            <Drawer
                variant="permanent"
                open={openDrawer}
                sx={{
                    '& .MuiDrawer-paper': {
                        position: 'relative',
                        whiteSpace: 'nowrap',
                        width: drawerWidth,
                        transition: theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                        boxSizing: 'border-box',
                        ...(!openDrawer && {
                            overflowX: 'hidden',
                            transition: theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.leavingScreen,
                            }),
                            width: theme.spacing(7),
                            [theme.breakpoints.up('sm')]: {
                                width: theme.spacing(9),
                            },
                        }),
                    },
                }}
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: [1],
                    }}
                >
                    <IconButton onClick={toggleDrawer}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List component="nav">
                    {menuItems.map((item) => (
                        <ListItemButton 
                            key={item.text} 
                            selected={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                        >
                            <ListItemIcon>
                                {React.cloneElement(item.icon, { color: location.pathname === item.path ? 'primary' : 'inherit' })}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>

            {/* 메인 콘텐츠 영역 */}
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                    {children}
                </Container>
            </Box>
        </Box>
    );
}

// --- 페이지 컴포넌트: 프로젝트 목록 ---
function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '', userId: 1 });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const navigate = useNavigate();

    const loadProjects = useCallback(async () => {
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            showSnackbar('프로젝트 목록을 불러오지 못했습니다.', 'error');
        }
    }, []);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    const handleCreate = async () => {
        if (!newProject.name) {
            showSnackbar('프로젝트 이름을 입력해주세요.', 'warning');
            return;
        }
        try {
            await createProject(newProject);
            showSnackbar('프로젝트가 생성되었습니다.', 'success');
            setOpenDialog(false);
            setNewProject({ name: '', description: '', userId: 1 });
            loadProjects();
        } catch (error) {
            console.error('Failed to create project:', error);
            showSnackbar('프로젝트 생성에 실패했습니다.', 'error');
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
        if (window.confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
            try {
                await deleteProject(id);
                showSnackbar('프로젝트가 삭제되었습니다.', 'success');
                loadProjects();
            } catch (error) {
                console.error('Failed to delete project:', error);
                showSnackbar('프로젝트 삭제에 실패했습니다.', 'error');
            }
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const filteredProjects = projects.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <>
            {/* 검색 및 필터 영역 */}
            <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', mb: 3, borderRadius: 2 }}
                elevation={0}
            >
                <IconButton sx={{ p: '10px' }} aria-label="menu">
                    <SearchIcon />
                </IconButton>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="프로젝트 검색 (이름, 설명)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
                    <FilterListIcon />
                </IconButton>
            </Paper>

            {/* 상단 액션 버튼 */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" component="h2" fontWeight="bold" color="text.secondary">
                    전체 프로젝트 ({filteredProjects.length})
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={() => setOpenDialog(true)}
                    sx={{ borderRadius: 2, px: 3, py: 1, boxShadow: 2 }}
                >
                    프로젝트 생성
                </Button>
            </Box>

            {/* 프로젝트 카드 그리드 */}
            <Grid container spacing={3}>
                {filteredProjects.map((project) => (
                    <Grid item xs={12} sm={6} md={4} key={project.id}>
                        <Card 
                            sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6, cursor: 'pointer' } }}
                            onClick={() => navigate(`/projects/${project.id}`)}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                    <Typography variant="h6" component="div" fontWeight="bold" noWrap>
                                        {project.name}
                                    </Typography>
                                    <Chip label="Active" size="small" color="success" variant="outlined" />
                                </Box>
                                <Typography sx={{ mb: 2, fontSize: '0.875rem' }} color="text.secondary">
                                    {project.createdAt.split(' ')[0]} 생성
                                </Typography>
                                <Typography variant="body2" color="text.primary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                    {project.description || "설명 없음"}
                                </Typography>
                            </CardContent>
                            <Divider />
                            <CardActions sx={{ display: 'flex', justifyContent: 'space-between', px: 2, py: 1 }}>
                                <IconButton size="small" color="primary" onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project.id}`); }}>
                                    <ArrowForwardIcon fontSize="small" />
                                </IconButton>
                                <IconButton size="small" onClick={(e) => handleDelete(project.id, e)} color="error">
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* 프로젝트 생성 모달 */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>새 프로젝트 생성</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="프로젝트 이름"
                        fullWidth
                        variant="outlined"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        sx={{ mb: 2, mt: 1 }}
                    />
                    <TextField
                        margin="dense"
                        label="설명"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenDialog(false)} color="inherit">취소</Button>
                    <Button onClick={handleCreate} variant="contained" disableElevation>생성하기</Button>
                </DialogActions>
            </Dialog>

            {/* 알림 메시지 (Snackbar) */}
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}

// --- 페이지 컴포넌트: 프로젝트 상세 ---
function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: '', description: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const fetchProject = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8080/projects/${id}`);
            setProject(response.data);
            setEditData({ name: response.data.name, description: response.data.description || '' });
        } catch (error) {
            console.error('Failed to fetch project detail:', error);
            showSnackbar('프로젝트 정보를 불러오지 못했습니다.', 'error');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProject();
    }, [fetchProject]);

    const handleSave = async () => {
        try {
            // userId는 필수값이므로 기존 프로젝트의 creator 정보를 유지하거나, 현재 로그인한 사용자 ID를 보내야 함
            // 여기서는 임시로 1번 사용자로 고정 (실제로는 로그인 세션 등에서 가져와야 함)
            const updatedData = { ...editData, userId: 1 }; 
            const updatedProject = await updateProject(id, updatedData);
            setProject(updatedProject);
            setIsEditing(false);
            showSnackbar('프로젝트 정보가 수정되었습니다.', 'success');
        } catch (error) {
            console.error('Failed to update project:', error);
            showSnackbar('프로젝트 수정에 실패했습니다.', 'error');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('정말로 이 프로젝트를 삭제하시겠습니까?')) {
            try {
                await deleteProject(id);
                showSnackbar('프로젝트가 삭제되었습니다.', 'success');
                navigate('/'); // 삭제 후 목록으로 이동
            } catch (error) {
                console.error('Failed to delete project:', error);
                showSnackbar('프로젝트 삭제에 실패했습니다.', 'error');
            }
        }
    };

    const handleCancel = () => {
        setEditData({ name: project.name, description: project.description || '' });
        setIsEditing(false);
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    if (loading) return <Typography>로딩 중...</Typography>;
    if (!project) return <Typography>프로젝트를 찾을 수 없습니다.</Typography>;

    return (
        <Box>
            <Box display="flex" alignItems="center" mb={2}>
                <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Breadcrumbs aria-label="breadcrumb">
                    <MuiLink underline="hover" color="inherit" href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                        홈
                    </MuiLink>
                    <Typography color="text.primary">프로젝트 상세</Typography>
                </Breadcrumbs>
            </Box>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    {isEditing ? (
                         <TextField 
                            label="프로젝트 이름" 
                            value={editData.name} 
                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                            fullWidth
                            sx={{ mr: 2 }}
                         />
                    ) : (
                        <Box display="flex" alignItems="center">
                             <Typography variant="h4" fontWeight="bold" component="h1" sx={{ mr: 2 }}>
                                {project.name}
                            </Typography>
                            <Chip label={`ID: ${project.id}`} variant="outlined" size="small" />
                        </Box>
                    )}
                    
                    <Box>
                        {isEditing ? (
                            <>
                                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} sx={{ mr: 1 }}>
                                    저장
                                </Button>
                                <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleCancel} color="inherit">
                                    취소
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setIsEditing(true)} sx={{ mr: 1 }}>
                                    수정
                                </Button>
                                <Button variant="outlined" startIcon={<DeleteIcon />} onClick={handleDelete} color="error">
                                    삭제
                                </Button>
                            </>
                        )}
                    </Box>
                </Box>
                
                <Divider sx={{ mb: 4 }} />
                
                {/* 정보를 한 줄에 하나씩 정렬 */}
                <Box display="flex" flexDirection="column" gap={3}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>설명</Typography>
                        {isEditing ? (
                            <TextField 
                                multiline 
                                rows={4} 
                                fullWidth 
                                value={editData.description}
                                onChange={(e) => setEditData({...editData, description: e.target.value})}
                            />
                        ) : (
                            <Typography variant="body1" sx={{ pl: 1, borderLeft: '4px solid #009688' }}>
                                {project.description || "설명이 없습니다."}
                            </Typography>
                        )}
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>생성일</Typography>
                        <Typography variant="body1" sx={{ pl: 1 }}>{project.createdAt}</Typography>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>최종 수정일</Typography>
                        <Typography variant="body1" sx={{ pl: 1 }}>{project.updatedAt}</Typography>
                    </Box>
                </Box>
            </Paper>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

function NotFound() {
    return (
        <Box textAlign="center" mt={10}>
            <Typography variant="h4" color="text.secondary">🚧 페이지 준비 중</Typography>
            <Typography variant="body1" mt={2}>아직 개발 중인 기능입니다.</Typography>
        </Box>
    );
}

function App() {
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<ProjectList />} />
                        <Route path="/projects/:id" element={<ProjectDetail />} />
                        <Route path="/users" element={<NotFound />} />
                        <Route path="/settings" element={<NotFound />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;