import PostMessage from '../models/PostMessage.js';
import mongoose from 'mongoose';

export const getPosts = async (req, res, next) => {
    try {
        const postMessages = await PostMessage.find();
        res.status(200).json(postMessages);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const createPost = async (req, res, next) => {
    const post = req.body;
    const newPost = new PostMessage(post);
    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
}

export const updatePost = async (req, res, next) => {
    const { id: _id } = req.params;
    const post = req.body;
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');
    try {
        const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true });
        res.json(updatedPost);
    } catch (err) {
        console.log(err);
    }
}

export const deletePost = async (req, res, next) => {
    const { id } = req.params;
    const post = req.body;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');
    try {
        await PostMessage.findByIdAndRemove(id);
        return res.json({ message: 'Post deleted successfully'});
    } catch (err) {
        console.log(err);
    }
}

export const likePost = async (req, res, next) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');
    const post = await PostMessage.findById(id);
    try {
        const updatedPost = await PostMessage.findByIdAndUpdate(id, {
            likeCount: post.likeCount++
        }, { new: true });
        res.json({ message: 'Like count updated successfully'});
    } catch (err) {
        console.log(err);
    }
}