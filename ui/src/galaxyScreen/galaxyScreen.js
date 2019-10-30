import React, { Component } from 'react'
import './styles.scss'
import { getWishes } from '../services/WishDetailsService'
import backgroundWebm from '../assets/gifs/MAW_BG.webm'
import toGoWebm from '../assets/gifs/MAW_To_Go.webm'
import toBeWebm from '../assets/gifs/MAW_To_Be.webm'
import toMeetWebm from '../assets/gifs/MAW_To_Meet.webm'
import toHaveWebm from '../assets/gifs/MAW_To_Have.webm'

export default class GalaxyScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            currentWebm: null,
            previousWishList: [],
            gifLookup: {}
        }
    }

    componentDidMount() {
        this.setState({
            currentWebm: 'MAW_BG.webm',
            gifLookup: {
              'MAW_BG.webm': backgroundWebm,
              'MAW_To_Go.webm': toGoWebm,
              'MAW_To_Be.webm': toBeWebm,
              'MAW_To_Meet.webm': toMeetWebm,
              'MAW_To_Have.webm': toHaveWebm,
            }
        },
        () => {
            setInterval(() => {
                this.handleCurrentWebm()
            },
            3000)
        })
    }

    handleCurrentWebm = async () => {
        const wishes = await getWishes()
        if (JSON.stringify(this.state.previousWishList) !== JSON.stringify(wishes)) {
            const difference = wishes.filter(wish => !this.state.previousWishList.some(prevWish => wish._id === prevWish._id));

            if (difference && difference.length > 0 && this.state.previousWishList.length > 0) {

                if (difference[0].type === 'go') {
                    this.setState({
                        currentWebm: 'MAW_To_Go.webm' // 13 seconds
                    }, () => {
                        this.playVideo()
                        setTimeout(() => {
                            this.setState({
                                currentWebm: 'MAW_BG.webm'
                            }, () => {
                                this.playVideo()
                            })
                        },
                        13000)
                    })
                } else if (difference[0].type === 'meet') {
                    this.setState({
                        currentWebm: 'MAW_To_Meet.webm' // 11 seconds
                    }, () => {
                        this.playVideo();
                        setTimeout(() => {
                            this.setState({
                                currentWebm: 'MAW_BG.webm'
                            }, () => {
                                this.playVideo()
                            })
                        },
                        11000)
                    })
                } else if (difference[0].type === 'be') {
                    this.setState({
                        currentWebm: 'MAW_To_Be.webm' // 11 seconds
                    }, () => {
                        this.playVideo();
                        setTimeout(() => {
                            this.setState({
                                currentWebm: 'MAW_BG.webm'
                            }, () => {
                                this.playVideo()
                            })
                        },
                        11000)
                    })
                } else {
                    this.setState({
                        currentWebm: 'MAW_To_Have.webm' // 13 seconds
                    }, () => {
                        this.playVideo();
                        setTimeout(() => {
                            this.setState({
                                currentWebm: 'MAW_BG.webm'
                            }, () => {
                                this.playVideo()
                            })
                        },
                        13000)
                    })
                }
            } else {
                this.setState({
                    currentWebm: 'MAW_BG.webm'
                }, () => {
                    this.playVideo();
                })
            }

            this.setState({
                previousWishList: wishes
            }, () => {
                this.playVideo();
            })
        }
    }

    getSourceURL = () => {
        if(process.env.REACT_APP_imageUrl) {
            return process.env.REACT_APP_imageUrl + this.state.currentWebm
        }
        return this.state.gifLookup[this.state.currentWebm]
    }

    playVideo = () => {
        this.refs.video.load();
        this.refs.video.play();
    }

    render() {
        return (
            <>
                <video loop muted autoPlay ref="video" className="fullscreen-bg__video">
                    <source src={this.getSourceURL()} type="video/webm" />
                </video>
            </>
        )
    }

}
