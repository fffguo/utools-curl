import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { Environment } from '../../store/modules/types';
import ConfirmDialog from '../common/ConfirmDialog';

interface EnvironmentManagerProps {
  onClose: () => void;
}

const EnvironmentManager: React.FC<EnvironmentManagerProps> = ({ onClose }) => {
  const { state, addEnvironment, updateEnvironment, deleteEnvironment } = useStore();
  const [editingEnv, setEditingEnv] = useState<Environment | null>(null);
  const [newEnv, setNewEnv] = useState<Omit<Environment, 'id'>>({
    name: '',
    baseUrl: '',
    variables: [],
    isDefault: false,
    isBuiltIn: false
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [envIdToDelete, setEnvIdToDelete] = useState<string | null>(null);
  
  // 重置表单
  const resetForm = () => {
    setNewEnv({
      name: '',
      baseUrl: '',
      variables: [],
      isDefault: false,
      isBuiltIn: false
    });
    setEditingEnv(null);
    setShowAddForm(false);
    setShowConfirmDialog(false);
    setEnvIdToDelete(null);
  };
  
  // 处理关闭
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  // 处理添加环境
  const handleAddEnvironment = () => {
    if (newEnv.name.trim()) {
      // 检查环境名是否重复
      const isNameDuplicate = state.environments.some(
        env => env.name === newEnv.name.trim()
      );
      
      if (isNameDuplicate) {
        alert('环境名已存在，请使用其他名称');
        return;
      }
      
      // 检查baseUrl格式
      if (newEnv.baseUrl) {
        if (!newEnv.baseUrl.startsWith('http://') && !newEnv.baseUrl.startsWith('https://')) {
          alert('环境地址必须以 http:// 或 https:// 开头');
          return;
        }
      }
      
      addEnvironment(newEnv);
      resetForm();
    }
  };
  
  // 处理编辑环境
  const handleEditEnvironment = () => {
    if (editingEnv && editingEnv.name.trim()) {
      // 检查环境名是否重复
      const isNameDuplicate = state.environments.some(
        env => env.name === editingEnv.name.trim() && env.id !== editingEnv.id
      );
      
      if (isNameDuplicate) {
        alert('环境名已存在，请使用其他名称');
        return;
      }
      
      // 检查baseUrl格式
      if (editingEnv.baseUrl) {
        if (!editingEnv.baseUrl.startsWith('http://') && !editingEnv.baseUrl.startsWith('https://')) {
          alert('环境地址必须以 http:// 或 https:// 开头');
          return;
        }
      }
      
      updateEnvironment(editingEnv);
      setEditingEnv(null);
    }
  };
  
  // 处理删除环境
  const handleDeleteEnvironment = (envId: string) => {
    setEnvIdToDelete(envId);
    setShowConfirmDialog(true);
  };
  
  // 处理确认删除
  const handleConfirmDelete = () => {
    if (envIdToDelete) {
      deleteEnvironment(envIdToDelete);
      setShowConfirmDialog(false);
      setEnvIdToDelete(null);
    }
  };
  
  // 处理取消删除
  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setEnvIdToDelete(null);
  };
  

  
  // 处理编辑按钮点击
  const handleEditClick = (env: Environment) => {
    setEditingEnv(env);
    setShowAddForm(false);
  };
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '18px',
        width: '600px',
        maxWidth: '90vw',
        maxHeight: '85vh',
        overflowY: 'auto',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
        animation: 'modalFadeIn 0.3s ease-out'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '20px',
            fontWeight: '600',
            color: '#2c3e50'
          }}>环境管理</h2>
          <button
            onClick={handleClose}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #e0e0e0',
              backgroundColor: '#ffffff',
              fontSize: '14px',
              cursor: 'pointer',
              color: '#666666',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f5f5f5';
              e.target.style.borderColor = '#d0d0d0';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.borderColor = '#e0e0e0';
            }}
          >
            关闭
          </button>
        </div>
        
        {/* 环境列表 */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ 
            border: '1px solid #e0e0e0', 
            borderBottom: 'none',
            borderRadius: '8px', 
            maxHeight: '320px', 
            overflowY: 'auto',
            backgroundColor: '#fafafa'
          }}>
            {state.environments.map((env) => (
              <div key={env.id} style={{
                padding: '8px',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                transition: 'background-color 0.2s ease'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: '600', 
                    marginBottom: '6px',
                    color: '#2c3e50',
                    fontSize: '14px'
                  }}>{env.name}</div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#666666', 
                  }}>前置URL: {env.baseUrl || '无'}</div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleEditClick(env)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      border: '1px solid #00a870',
                      backgroundColor: '#ffffff',
                      fontSize: '13px',
                      cursor: 'pointer',
                      color: '#00a870',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f6ffed';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#ffffff';
                    }}
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDeleteEnvironment(env.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      border: '1px solid #ff4d4f',
                      backgroundColor: '#ffffff',
                      fontSize: '12px',
                      cursor: 'pointer',
                      color: '#ff4d4f',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#fff1f0';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#ffffff';
                    }}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 添加环境按钮 */}
        {!showAddForm && !editingEnv && (
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: '1px solid #00a870',
              backgroundColor: '#00a870',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#36c59f';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 168, 112, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#00a870';
              e.target.style.boxShadow = 'none';
            }}
          >
            <span>+</span>
            添加环境
          </button>
        )}
        
        {/* 添加/编辑环境表单 */}
        {(showAddForm || editingEnv) && (
          <div style={{ 
            border: '1px solid #e0e0e0', 
            borderRadius: '8px', 
            padding: '8px',
            backgroundColor: '#fafafa',
            animation: 'formSlideIn 0.3s ease-out'
          }}>
            <h3 style={{ 
              margin: '0 0 20px 0', 
              fontSize: '16px',
              fontWeight: '500',
              color: '#333333'
            }}>
              {editingEnv ? '编辑环境' : '添加环境'}
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '14px',
                fontWeight: '500',
                color: '#333333'
              }}>环境名称 <span style={{ color: '#ff4d4f' }}>*</span></label>
              <input
                type="text"
                value={editingEnv ? editingEnv.name : newEnv.name}
                onChange={(e) => editingEnv 
                  ? setEditingEnv({ ...editingEnv, name: e.target.value })
                  : setNewEnv({ ...newEnv, name: e.target.value })
                }
                style={{
                  width: '100%',
                  padding: '8px 8px',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00a870';
                  e.target.style.boxShadow = '0 0 0 2px rgba(0, 168, 112, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontSize: '14px',
                fontWeight: '500',
                color: '#333333'
              }}>前置URL</label>
              <input
                type="text"
                value={editingEnv ? editingEnv.baseUrl : newEnv.baseUrl || 'http://'}
                onChange={(e) => {
                  const value = e.target.value;
                  if (editingEnv) {
                    setEditingEnv({ ...editingEnv, baseUrl: value });
                  } else {
                    setNewEnv({ ...newEnv, baseUrl: value });
                  }
                }}
                style={{
                  width: '100%',
                  padding: '8px 8px',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  transition: 'border-color 0.2s ease'
                }}
                placeholder="例如: http://api.example.com"
                onFocus={(e) => {
                  e.target.style.borderColor = '#00a870';
                  e.target.style.boxShadow = '0 0 0 2px rgba(0, 168, 112, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            

            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  resetForm();
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0',
                  backgroundColor: '#ffffff',
                  fontSize: '12px',
                  cursor: 'pointer',
                  color: '#666666',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f5f5f5';
                  e.target.style.borderColor = '#d0d0d0';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.borderColor = '#e0e0e0';
                }}
              >
                取消
              </button>
              <button
                onClick={editingEnv ? handleEditEnvironment : handleAddEnvironment}
                disabled={!(editingEnv ? editingEnv.name.trim() : newEnv.name.trim())}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid #00a870',
                  backgroundColor: '#00a870',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: !(editingEnv ? editingEnv.name.trim() : newEnv.name.trim()) ? 'not-allowed' : 'pointer',
                  opacity: !(editingEnv ? editingEnv.name.trim() : newEnv.name.trim()) ? 0.5 : 1,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (editingEnv ? editingEnv.name.trim() : newEnv.name.trim()) {
                    e.target.style.backgroundColor = '#36c59f';
                  }
                }}
                onMouseLeave={(e) => {
                  if (editingEnv ? editingEnv.name.trim() : newEnv.name.trim()) {
                    e.target.style.backgroundColor = '#00a870';
                  }
                }}
              >
                {editingEnv ? '保存修改' : '添加环境'}
              </button>
            </div>
          </div>
        )}
        
        <style jsx>{`
          @keyframes modalFadeIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes formSlideIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
      
      {/* 确认删除弹框 */}
      <ConfirmDialog
        visible={showConfirmDialog}
        title="确认删除"
        message="确定要删除这个环境吗？"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default EnvironmentManager;