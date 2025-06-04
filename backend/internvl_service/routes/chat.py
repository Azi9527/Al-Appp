from flask import Blueprint, request, jsonify
from models.internvl_model import InternVLModel
import logging
import base64
import io
from PIL import Image

chat_bp = Blueprint('chat', __name__)
logger = logging.getLogger(__name__)

# 全局模型实例
model = None

def get_model():
    global model
    if model is None:
        model = InternVLModel()
    return model

@chat_bp.route('/internvl/chat', methods=['POST'])
def internvl_chat():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': '请求数据为空'}), 400
            
        image_data = data.get('image')
        question = data.get('question', '请描述这张图片')
        
        # 添加调试日志
        logger.info(f"接收到的问题: {question}")
        logger.info(f"原始数据中的question字段: {data.get('question')}")
        
        if not image_data:
            return jsonify({'error': '缺少图片数据'}), 400
        
        # 解码base64图片
        try:
            image_bytes = base64.b64decode(image_data.split(',')[1])
            image = Image.open(io.BytesIO(image_bytes))
        except Exception as e:
            logger.error(f"图片解码失败: {e}")
            return jsonify({'error': '图片格式错误'}), 400
        
        # 获取模型并进行推理
        model_instance = get_model()
        response = model_instance.chat(image, question)
        
        logger.info(f"推理完成，问题: {question}")
        return jsonify({
            'response': response,
            'status': 'success'
        })
        
    except Exception as e:
        logger.error(f"处理请求时发生错误: {e}")
        return jsonify({'error': f'服务器内部错误: {str(e)}'}), 500